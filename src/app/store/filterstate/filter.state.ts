export interface FilterState {
  query:string,
  pageUrl:string,
  categories: number[],
  materials: number[],
  material_name: string,
  coordinates:[any, any],
  location_name: string,
  distance: number
}
