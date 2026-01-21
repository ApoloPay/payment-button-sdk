import { Network } from "./network"

export interface Asset {
  id: string
  name: string
  symbol: string
  image: string
  networks: Network[]
}
