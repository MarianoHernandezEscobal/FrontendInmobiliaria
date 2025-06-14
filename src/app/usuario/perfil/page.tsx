"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedPage } from "@/components/protected-page";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";
import { LogOut, Mail, Phone, Save, UserIcon } from "lucide-react";
import { changePassword } from "@/service/user";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PerfilPage() {
  const router = useRouter();
  const { user, token, logoutUser, updateUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [formChangePassword, setFormChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePasswordInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormChangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateUserProfile(formData);
      toast.success("Perfil actualizado con éxito");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formChangePassword.newPassword !== formChangePassword.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      setIsLoading(true);
      if (token) {
        await changePassword(formChangePassword, token);
      } else {
        toast.error("Token no válido. Por favor, inicia sesión nuevamente.");
      }
      toast.success("Cambio de contraseña exitoso");
      // Opcional: limpiar campos
      setFormChangePassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error("Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/");
    toast.success("Sesión cerrada con éxito");
  };

  return (
    <ProtectedPage>
      <div className="container nav_padding mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Columna izquierda - Información del perfil */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="flex flex-col items-center p-4">
                <CardTitle>
                  {user?.firstName} {user?.lastName}
                </CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{user?.email || "No especificado"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{user?.phone || "No especificado"}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    Miembro desde{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Columna derecha - Tabs con diferentes secciones */}
          <div className="md:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Información Personal</TabsTrigger>
                <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
              </TabsList>

              {/* Tab: Información Personal */}
              <TabsContent value="personal">
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información personal y datos de contacto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? (
                            "Guardando..."
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Guardar Cambios
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="ml-auto"
                      >
                        Editar Información
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Tab: Seguridad */}
              <TabsContent value="seguridad">
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>Seguridad de la Cuenta</CardTitle>
                    <CardDescription>
                      Gestiona tu contraseña y la seguridad de tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contraseña Actual */}
                    <div className="space-y-2 relative">
                      <Label htmlFor="currentPassword">Contraseña Actual</Label>
                      <Input
                        type={showPassword.current ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={formChangePassword.currentPassword}
                        onChange={handleChangePasswordInput}
                        placeholder="Ingresa tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-muted-foreground hover:text-primary"
                        >
                        {!showPassword.current ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Nueva Contraseña */}
                    <div className="space-y-2 relative">
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <Input
                        type={showPassword.new ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={formChangePassword.newPassword}
                        onChange={handleChangePasswordInput}
                        placeholder="Ingresa su nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-muted-foreground hover:text-primary"
                        >
                        {!showPassword.new ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Confirmar Nueva Contraseña */}
                    <div className="space-y-2 relative">
                      <Label htmlFor="confirmPassword">
                        Confirmar Nueva Contraseña
                      </Label>
                      <Input
                        type={showPassword.confirm ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formChangePassword.confirmPassword}
                        onChange={handleChangePasswordInput}
                        placeholder="Confirma su nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-muted-foreground hover:text-primary"
                        >
                        {!showPassword.confirm ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <Separator className="my-2" />
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handleChangePassword}
                      disabled={isLoading}
                    >
                      {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
