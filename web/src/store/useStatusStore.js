import { create } from 'zustand'
import { fetchStatusBoard, postStatus } from '../api/endpoints/communityStatus.js'

export const useStatusStore = create((set, get) => ({
  board: null,
  myStatus: null,
  loading: false,
  error: null,

  loadBoard: async () => {
    set({ loading: true, error: null })
    try {
      const board = await fetchStatusBoard()
      set({ board, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  setStatus: async ({ status, note }) => {
    const entry = await postStatus({ status, note })
    const board = get().board
    if (board) {
      set({
        board: { ...board, updates: [entry, ...board.updates] },
        myStatus: status,
      })
    } else {
      set({ myStatus: status })
    }
    return entry
  },
}))
