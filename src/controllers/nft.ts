import MainController from './main'
import { NftServices } from '../services/nft'

class NftController extends MainController {
    
    constructor(private nftService: NftServices) {
        super(nftService)
        this.setRoutes()
    }
}

export default NftController