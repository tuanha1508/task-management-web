import { reactive } from 'vue'
import { io, Socket } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const state = reactive({
  connected: false,
  error: null
})

let socket: Socket | null = null

export const socketPlugin = {
  install: (app: any) => {
    app.config.globalProperties.$socket = {
      connect() {
        const token = localStorage.getItem('token')
        
        if (!token) {
          return
        }
        
        socket = io(API_URL, {
          extraHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
        
        socket.on('connect', () => {
          state.connected = true
          state.error = null
          
          // Join tasks room
          socket.emit('join:tasks')
        })
        
        socket.on('disconnect', () => {
          state.connected = false
        })
        
        socket.on('connect_error', (err) => {
          state.error = err.message
        })
      },
      
      disconnect() {
        if (socket) {
          socket.disconnect()
          socket = null
        }
      },
      
      emit(event: string, data?: any) {
        if (socket) {
          return new Promise((resolve, reject) => {
            socket!.emit(event, data, (response: any) => {
              if (response.error) {
                reject(response.error)
              } else {
                resolve(response)
              }
            })
          })
        }
        return Promise.reject('Socket not connected')
      },
      
      on(event: string, callback: Function) {
        if (socket) {
          socket.on(event, callback)
        }
      },
      
      off(event: string, callback?: Function) {
        if (socket) {
          socket.off(event, callback)
        }
      }
    }
    
    app.provide('socket', app.config.globalProperties.$socket)
  }
}