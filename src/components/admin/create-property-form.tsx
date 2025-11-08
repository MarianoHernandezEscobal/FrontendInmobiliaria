"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Neighborhoods, PropertyStatus, PropertyTypes } from "@/types/property"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ImageUploader } from "@/components/admin/image-uploader"
import { toast } from "sonner"
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { PropertyTypeLabels } from "@/utils/type-label"
import { PropertyStatusLabels } from "@/utils/status-label"
import { MultiSelect } from "../multi-select"
import { createProperty } from "@/service/properties"
import { NeighborhoodLabels } from "@/utils/neighborhoods-labels"
import { useUser } from "@/context/user-context"
import { useProperties } from "@/context/property-context"
import { LocationPicker } from "./location-picker"

// Tipo para los valores del formulario
interface PropertyFormValues {
  // Información básica
  title: string
  shortDescription: string
  longDescription: string
  type: PropertyTypes | string
  status: PropertyStatus[]
  price: number
  contribution?: number

  // Características físicas
  lotSize: number
  area?: number
  rooms?: number
  bathrooms?: number
  yearBuilt?: number
  pool: boolean
  garage: boolean

  // Ubicación
  address: string
  neighborhood: Neighborhoods
  geoCoordinates: {
    lat: number
    lng: number
  }
  features: string

  // Imágenes
  imageSrc: string[]

  // Metadatos
  pinned: boolean
  approved: boolean
  facebook: boolean
  createdAt: string
}

export default function CreatePropertyForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const { token } = useUser()
  const { reloadProperties } = useProperties()
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    basic: false,
    details: false,
    location: false,
    images: false,
    review: false,
  })
  const [showCustomType, setShowCustomType] = useState(false)

  const defaultValues: Partial<PropertyFormValues> = {
    title: "",
    shortDescription: "",
    longDescription: "",
    type: PropertyTypes.HOUSE,
    status: [PropertyStatus.ForSale],
    price: undefined,
    contribution: undefined,
    lotSize: undefined,
    features:
      '[{"title":"Casa Principal","values":[{"title":"Cimientos","value":""},{"title":"Paredes","value":""},{"title":"Techo","value":""},{"title":"Pisos","value":""},{"title":"Aberturas","value":""}]}]',
    area: undefined,
    rooms: undefined,
    bathrooms: undefined,
    yearBuilt: undefined,
    pool: false,
    garage: false,
    address: "",
    neighborhood: undefined,
    geoCoordinates: {
      lat: -34.6345508,
      lng: -54.1634234,
    },
    imageSrc: [],
    pinned: false,
    approved: true,
    facebook: true,
    createdAt: new Date().toISOString(),
  }

  const form = useForm<PropertyFormValues>({
    defaultValues,
    mode: "onChange",
  })

  const markStepCompleted = (step: string, isCompleted = true) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [step]: isCompleted,
    }))
  }

  const validateStep = (step: string) => {
    const formValues = form.getValues()

    switch (step) {
      case "basic":
        const basicFields = ["title", "shortDescription", "longDescription", "type", "status", "price"]
        const basicValid = basicFields.every((field) => {
          const value = formValues[field as keyof PropertyFormValues]
          return value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true)
        })
        markStepCompleted("basic", basicValid)
        return basicValid

      case "details":
        const detailsFields = ["lotSize"]
        const detailsValid = detailsFields.every((field) => {
          const value = formValues[field as keyof PropertyFormValues]
          return value !== undefined && value !== "" && (typeof value === "number" ? value > 0 : true)
        })
        markStepCompleted("details", detailsValid)
        return detailsValid

      case "features":
        const features = formValues.features ? JSON.parse(formValues.features) : []
        const featuresValid =
          features.length > 0 && features.every((feature: any) => feature.title && feature.values.length > 0)
        markStepCompleted("features", featuresValid)
        return featuresValid

      case "location":
        const locationFields = ["address", "neighborhood", "geoCoordinates"]
        const locationValid = locationFields.every((field) => {
          const value = formValues[field as keyof PropertyFormValues]
          if (field === "geoCoordinates") {
            return value && (value as any).lat && (value as any).lng
          }
          return value !== undefined && value !== ""
        })
        markStepCompleted("location", locationValid)
        return locationValid

      case "images":
        const imagesValid = formValues.imageSrc && formValues.imageSrc.length > 0
        markStepCompleted("images", imagesValid)
        return imagesValid

      default:
        return false
    }
  }

  const handleTabChange = (value: string) => {
    if (activeTab) {
      validateStep(activeTab)
    }

    setActiveTab(value)
  }

  // Función para ir al siguiente paso
  const goToNextStep = () => {
    const steps = ["basic", "details", "features", "location", "images", "review"]
    const currentIndex = steps.indexOf(activeTab)

    if (currentIndex < steps.length - 1) {
      const isValid = validateStep(activeTab)

      if (isValid) {
        const nextStep = steps[currentIndex + 1]
        setActiveTab(nextStep)
      } else {
        toast.error("Información incompleta")
      }
    }
  }

  // Función para ir al paso anterior
  const goToPreviousStep = () => {
    const steps = ["basic", "details", "features", "location", "images", "review"]
    const currentIndex = steps.indexOf(activeTab)

    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1]
      setActiveTab(prevStep)
    }
  }

  // Función para manejar el envío del formulario
  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true)

      if (!token) {
        toast.error("Sesión expirada. Por favor inicie sesión nuevamente.")
        router.push("/login")
        return
      }

      console.log("Datos de la propiedad:", data)

      const propertie = await createProperty(data, data.facebook, imageFiles, token)
      toast.success("Propiedad creada con éxito")
      await reloadProperties();
      router.push("/propiedades/" + propertie.id)
    } catch (error) {
      console.error("Error al crear la propiedad:", error)
      toast.error("Error al crear la propiedad")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para renderizar el indicador de estado del paso
  const renderStepIndicator = (step: string) => {
    if (completedSteps[step]) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    }
    return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
  }

  return (
    <div className="container nav_padding mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Crear Nueva Propiedad</h1>
        <p className="text-muted-foreground mt-2">Complete el formulario para añadir una nueva propiedad al sistema.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="pb-4">
            <CardContent className="pt-6">
              {/* Pasos del formulario */}
              <div className="mb-8 flex items-center justify-between">
                <div onClick={() => handleTabChange("basic")} className="flex cursor-pointer items-center gap-2">
                  {renderStepIndicator("basic")}
                  <span className={activeTab === "basic" ? "font-medium" : "text-muted-foreground"}>
                    Información Básica
                  </span>
                </div>
                <div className="h-px w-8 bg-muted" />
                <div onClick={() => handleTabChange("details")} className="flex cursor-pointer items-center gap-2">
                  {renderStepIndicator("details")}
                  <span className={activeTab === "details" ? "font-medium" : "text-muted-foreground"}>
                    Características
                  </span>
                </div>
                <div className="h-px w-8 bg-muted" />
                <div onClick={() => handleTabChange("features")} className="flex cursor-pointer items-center gap-2">
                  {renderStepIndicator("features")}
                  <span className={activeTab === "features" ? "font-medium" : "text-muted-foreground"}>
                    Construcción
                  </span>
                </div>
                <div className="h-px w-8 bg-muted" />
                <div onClick={() => handleTabChange("location")} className="flex cursor-pointer items-center gap-2">
                  {renderStepIndicator("location")}
                  <span className={activeTab === "location" ? "font-medium" : "text-muted-foreground"}>Ubicación</span>
                </div>
                <div className="h-px w-8 bg-muted" />
                <div onClick={() => handleTabChange("images")} className="flex cursor-pointer items-center gap-2">
                  {renderStepIndicator("images")}
                  <span className={activeTab === "images" ? "font-medium" : "text-muted-foreground"}>Imágenes</span>
                </div>
                <div className="h-px w-8 bg-muted" />
                <div onClick={() => handleTabChange("review")} className="flex cursor-pointer items-center gap-2">
                  {renderStepIndicator("review")}
                  <span className={activeTab === "review" ? "font-medium" : "text-muted-foreground"}>Revisión</span>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {/* Pestaña: Información Básica */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      rules={{
                        required: "El título es obligatorio",
                        minLength: {
                          value: 5,
                          message: "El título debe tener al menos 5 caracteres",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Casa de 3 dormitorios en Arachania" {...field} />
                          </FormControl>
                          <FormDescription>Título descriptivo de la propiedad.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      rules={{
                        required: "El precio es obligatorio",
                        min: {
                          value: 1,
                          message: "El precio debe ser mayor a 0",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio (USD)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Ej: 150000"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Precio de venta o alquiler en dólares.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              rules={{
                required: "El tipo de propiedad es obligatorio",
                validate: (value) => {
                  if (showCustomType && (!value || value.trim() === "")) {
                    return "Debe especificar el tipo de propiedad"
                  }
                  return true
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Propiedad</FormLabel>
                  {!showCustomType ? (
                    <Select
                      onValueChange={(value) => {
                        if (value === PropertyTypes.OTHER) {
                          setShowCustomType(true)
                          field.onChange("")
                        } else {
                          field.onChange(value)
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PropertyTypes).map((type) => (
                          <SelectItem key={type} value={type}>
                            {PropertyTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-2">
                      <FormControl>
                        <Input
                          placeholder="Especifique el tipo de propiedad"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCustomType(false)
                          field.onChange(PropertyTypes.HOUSE)
                        }}
                      >
                        Volver a opciones predefinidas
                      </Button>
                    </div>
                  )}
                  <FormDescription>
                    {showCustomType
                      ? "Escriba el tipo de propiedad personalizado."
                      : "Tipo de propiedad que está registrando. Seleccione 'Otro' para especificar un tipo personalizado."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contribution"
              rules={{
                required: "La contribución es obligatorio",
                min: {
                  value: 1,
                  message: "La contribución debe ser mayor a 0",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contribución</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 500" {...field} />
                  </FormControl>
                  <FormDescription>Contribución mensual de la propiedad.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
                  <FormField
                    control={form.control}
                    name="status"
                    rules={{
                      required: "Debe seleccionar al menos un estado",
                      validate: (value) => value.length > 0 || "Seleccione al menos un estado",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado de la Propiedad</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={Object.entries(PropertyStatusLabels).map(([value, label]) => ({
                              label,
                              value,
                            }))}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Seleccione estados de la propiedad"
                          />
                        </FormControl>
                        <FormDescription>Seleccione el estado actual de la propiedad.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    rules={{
                      required: "La descripción corta es obligatoria",
                      minLength: {
                        value: 10,
                        message: "La descripción corta debe tener al menos 10 caracteres",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción Corta</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve descripción de la propiedad (máximo 150 caracteres)"
                            className="resize-none"
                            {...field}
                            maxLength={150}
                          />
                        </FormControl>
                        <FormDescription>Esta descripción aparecerá en las tarjetas de listado.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longDescription"
                    rules={{
                      required: "La descripción completa es obligatoria",
                      minLength: {
                        value: 50,
                        message: "La descripción completa debe tener al menos 50 caracteres",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción Completa</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción detallada de la propiedad"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Descripción detallada que aparecerá en la página de la propiedad.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Pestaña: Características */}
                <TabsContent value="details" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="lotSize"
                      rules={{
                        required: "El tamaño del terreno es obligatorio",
                        min: {
                          value: 1,
                          message: "El tamaño debe ser mayor a 0",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamaño del Terreno (m²)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Ej: 500"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Área total del terreno en metros cuadrados.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área Construida (m²)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Ej: 120"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>Área construida en metros cuadrados.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="rooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dormitorios</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Ej: 3"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>Número de dormitorios.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baños</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Ej: 2"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>Número de baños.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearBuilt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Año de Construcción</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1900"
                              max={new Date().getFullYear()}
                              placeholder="Ej: 2010"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>Año en que se construyó la propiedad.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="pool"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Piscina</FormLabel>
                            <FormDescription>La propiedad cuenta con piscina.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="garage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Garage</FormLabel>
                            <FormDescription>La propiedad cuenta con garage o estacionamiento.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pinned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Destacar Propiedad</FormLabel>
                          <FormDescription>
                            Marcar esta propiedad como destacada para que aparezca en la página principal.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                {/* Pestaña: Features */}
                <TabsContent value="features" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      const features = field.value ? JSON.parse(field.value) : []

                      const updateFeature = (index: number, key: "title", value: string) => {
                        const updated = [...features]
                        updated[index][key] = value
                        field.onChange(JSON.stringify(updated))
                      }

                      const updateFeatureItem = (
                        featureIndex: number,
                        itemIndex: number,
                        key: "title" | "value",
                        value: string,
                      ) => {
                        const updated = [...features]
                        updated[featureIndex].values[itemIndex][key] = value
                        field.onChange(JSON.stringify(updated))
                      }

                      const addFeature = () => {
                        const updated = [...features, { title: "", values: [] }]
                        field.onChange(JSON.stringify(updated))
                      }

                      const removeFeature = (index: number) => {
                        const updated = [...features]
                        updated.splice(index, 1)
                        field.onChange(JSON.stringify(updated))
                      }

                      const addItem = (featureIndex: number) => {
                        const updated = [...features]
                        updated[featureIndex].values.push({
                          title: "",
                          value: "",
                        })
                        field.onChange(JSON.stringify(updated))
                      }

                      const removeItem = (featureIndex: number, itemIndex: number) => {
                        const updated = [...features]
                        updated[featureIndex].values.splice(itemIndex, 1)
                        field.onChange(JSON.stringify(updated))
                      }

                      return (
                        <FormItem>
                          <FormLabel>Características Especiales</FormLabel>
                          <FormDescription>
                            Agregue categorías y valores personalizados para la propiedad.
                          </FormDescription>
                          <FormControl>
                            <div className="space-y-6">
                              {features.map((feature: any, featureIndex: number) => (
                                <div key={featureIndex} className="border p-4 rounded-lg space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Input
                                      placeholder="Título de la categoría (ej: Jardín, Cocina)"
                                      value={feature.title}
                                      onChange={(e) => updateFeature(featureIndex, "title", e.target.value)}
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      onClick={() => removeFeature(featureIndex)}
                                    >
                                      Eliminar
                                    </Button>
                                  </div>

                                  <div className="space-y-4">
                                    {feature.values.map((item: any, itemIndex: number) => (
                                      <div key={itemIndex} className="flex gap-2 ml-12 items-center">
                                        <Input
                                          placeholder="Título"
                                          value={item.title}
                                          onChange={(e) =>
                                            updateFeatureItem(featureIndex, itemIndex, "title", e.target.value)
                                          }
                                        />
                                        <Input
                                          placeholder="Valor"
                                          value={item.value}
                                          onChange={(e) =>
                                            updateFeatureItem(featureIndex, itemIndex, "value", e.target.value)
                                          }
                                        />
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          onClick={() => removeItem(featureIndex, itemIndex)}
                                        >
                                          Eliminar
                                        </Button>
                                      </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={() => addItem(featureIndex)}>
                                      Agregar Ítem
                                    </Button>
                                  </div>
                                </div>
                              ))}

                              <Button type="button" className="w-full" onClick={addFeature}>
                                Agregar Nueva Categoría
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </TabsContent>

                {/* Pestaña: Ubicación */}
                <TabsContent value="location" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address"
                      rules={{
                        required: "La dirección es obligatoria",
                        minLength: {
                          value: 5,
                          message: "La dirección debe tener al menos 5 caracteres",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Parada 18" {...field} />
                          </FormControl>
                          <FormDescription>Dirección completa de la propiedad.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="neighborhood"
                      rules={{
                        required: "El barrio es obligatorio",
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barrio</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione un barrio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(Neighborhoods).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {NeighborhoodLabels[type]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Barrio o zona donde se encuentra la propiedad.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="geoCoordinates"
                    rules={{
                      required: "La ubicación en el mapa es obligatoria",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación en el Mapa</FormLabel>
                        <FormControl>
                          <LocationPicker value={field.value} onChange={(value) => field.onChange(value)} />
                        </FormControl>
                        <FormDescription>Seleccione la ubicación exacta de la propiedad en el mapa.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Pestaña: Imágenes */}
                <TabsContent value="images" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="imageSrc"
                    rules={{
                      required: "Debe subir al menos una imagen",
                      validate: (value) => value.length > 0 || "Debe subir al menos una imagen",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imágenes de la Propiedad</FormLabel>
                        <FormControl>
                          <ImageUploader
                            value={field.value}
                            onChange={(previews, files) => {
                              field.onChange(previews)
                              setImageFiles(files || [])
                            }}
                            maxFiles={50}
                          />
                        </FormControl>
                        <FormDescription>
                          Suba imágenes de la propiedad. La primera imagen será la principal.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Pestaña: Revisión */}
                <TabsContent value="review" className="space-y-6">
                  <div className="rounded-lg border p-6">
                    <h3 className="text-lg font-medium">Resumen de la Propiedad</h3>
                    <Separator className="my-4" />

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium">Información Básica</h4>
                        <dl className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Título:</dt>
                            <dd className="text-sm font-medium">{form.watch("title") || "No especificado"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Precio:</dt>
                            <dd className="text-sm font-medium">
                              {form.watch("price") ? `USD ${form.watch("price").toLocaleString()}` : "No especificado"}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Tipo:</dt>
                            <dd className="text-sm font-medium">{form.watch("type") || "No especificado"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Estado:</dt>
                            <dd className="text-sm font-medium">
                              {form.watch("status")?.length > 0 ? form.watch("status").join(", ") : "No especificado"}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h4 className="font-medium">Características</h4>
                        <dl className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Terreno:</dt>
                            <dd className="text-sm font-medium">
                              {form.watch("lotSize") ? `${form.watch("lotSize")} m²` : "No especificado"}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Área:</dt>
                            <dd className="text-sm font-medium">
                              {form.watch("area") ? `${form.watch("area")} m²` : "No especificado"}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Dormitorios:</dt>
                            <dd className="text-sm font-medium">{form.watch("rooms") || "No especificado"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Baños:</dt>
                            <dd className="text-sm font-medium">{form.watch("bathrooms") || "No especificado"}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="font-medium">Ubicación</h4>
                      <dl className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Dirección:</dt>
                          <dd className="text-sm font-medium">{form.watch("address") || "No especificado"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Barrio:</dt>
                          <dd className="text-sm font-medium">{form.watch("neighborhood") || "No especificado"}</dd>
                        </div>
                      </dl>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="font-medium">Imágenes</h4>
                      <div className="mt-2">
                        {form.watch("imageSrc")?.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {form.watch("imageSrc").map((src, index) => (
                              <div key={index} className="relative h-20 w-full overflow-hidden rounded-md">
                                <img
                                  src={src || "/placeholder.svg"}
                                  alt={`Imagen ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No se han subido imágenes</p>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="font-medium">Descripción</h4>
                      <div className="mt-2 rounded-md bg-muted p-3">
                        <p className="text-sm">
                          {form.watch("longDescription") || "No se ha proporcionado una descripción"}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Publicar en Facebook</FormLabel>
                              <FormDescription>
                                Marque esta opción si desea publicar esta propiedad automáticamente en Facebook.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
                    <p className="text-sm">
                      Por favor, revise cuidadosamente toda la información antes de crear la propiedad. Una vez creada,
                      algunos campos no podrán ser modificados.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-between">
                <Button
                  className="bg-nav hover:bg-accent text-white"
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={activeTab === "basic"}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                {activeTab !== "review" ? (
                  <Button type="button" className="bg-nav hover:bg-accent" onClick={goToNextStep}>
                    Siguiente
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      "Crear Propiedad"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
