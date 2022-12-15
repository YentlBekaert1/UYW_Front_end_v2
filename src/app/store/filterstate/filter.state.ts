export interface FilterState {
  query:string,
  pageUrl:string,
  categories: number[],
  categorie_name: string,
  materials: number[],
  material_name: string,
  coordinates:[any, any],
  location_name: string,
  distance: number
}
