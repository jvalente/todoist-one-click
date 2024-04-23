import { deleteAPIKey } from './api-key'
import { Storage } from '../api/extension'

export function clearAllData() {
    deleteAPIKey()

    Storage.reset()
}
