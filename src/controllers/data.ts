import { Storage } from '../api/extension'
import { deleteAPIKey } from './api-key'

export function clearAllData() {
    deleteAPIKey()

    Storage.reset()
}
