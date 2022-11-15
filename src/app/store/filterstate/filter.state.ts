export interface FilterState {
  query:string,
  pageUrl:string,
  categories: number[],
  materials: number[],
  coordinates:[any, any],
  distance: number
}
