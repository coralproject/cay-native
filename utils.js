
import XeniaDriver from './xenia-driver';

const keys = {
  "auth": "Basic NmQ3MmU2ZGQtOTNkMC00NDEzLTliNGMtODU0NmQ0ZDM1MTRlOlBDeVgvTFRHWjhOdGZWOGVReXZObkpydm4xc2loQk9uQW5TNFpGZGNFdnc9",
  "baseURL": "https://demo.coralproject.net/xenia_api/1.0"
}

export const xenia = XeniaDriver(keys.baseURL, keys.auth)

export const pillarHost = 'https://demo.coralproject.net/pillar_api/1.0'
