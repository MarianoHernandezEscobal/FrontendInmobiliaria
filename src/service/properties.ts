
import { BASE_URL } from "@/constants/constants";
import { Home } from "@/types/home";
import { Property } from "@/types/property";
import axios from 'axios';

export async function GetPropertyById(id: number): Promise<any> {
    const url = `${BASE_URL}/properties/findOne`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': '*/*',
            },
            params: {
                id
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching property:', error);
        throw error;
    }
}

export async function GetAllProperties(): Promise<Property[]> {
    const url = `${BASE_URL}/properties/findAll`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': '*/*',
            },
        });
        const properties = response.data;
        localStorage.setItem('AllProperties', JSON.stringify(properties))
        return properties;
    } catch (error) {
        console.error('Error fetching property:', error);
        throw error;
    }
}

export async function GetHomeProperties(): Promise<Home> {
    const url = `${BASE_URL}/properties/home`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': '*/*',
            },
        });
        const home = response.data;
        localStorage.setItem('Home', JSON.stringify(home))
        return home;
    } catch (error) {
        console.error('Error fetching property:', error);
        throw error;
    }
}

export const createProperty = async (propertyData: Omit<Property, 'id'>, files: File[], token: string) => {
    const formData = new FormData();

    formData.append("property", JSON.stringify(propertyData));

    files.forEach((file) => formData.append("files", file));

    try {
        const response = await axios.post(`${BASE_URL}/properties/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating property:', error);
        throw error;
    }
};

export const updateProperty = async (
    propertyData: Property,
    deletedImages: string[],
    newImages: File[],
    token: string
  ) => {
    const formData = new FormData();
    formData.append("property", JSON.stringify(propertyData));
    formData.append("deletedImages", JSON.stringify(deletedImages));
    newImages.forEach((file) => formData.append("files", file));
    const res = await axios.put(`${BASE_URL}/properties/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': token,
      },
    });
  
    return await res.data;
  };

  export const deleteProperty = async (id: number, token:string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${BASE_URL}/properties/delete?id=${id}`, 
        {
          headers: {
            'Accept': '*/*',
            'authorization': token,
          },
        }
      );
      return response.data;
    }catch(error){
      console.error("Error al cargar las propiedades:", error);
      return false;
    }
  }