import { Storage } from '../api/extension'
import { deleteAPIKey } from './api-key'

export async function clearAllData() {
    await deleteAPIKey()
    Storage.reset()
}
