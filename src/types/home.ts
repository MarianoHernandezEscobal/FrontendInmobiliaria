import { Property } from "./property";

export interface Home{
    properties: Property[];
    land: Property[];
    pinned: Property[];
    favourites?: Property[];
    created?: Property[];
}