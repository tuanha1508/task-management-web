import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(EventsGateway.name);
  private readonly connectedClients = new Map<string, number>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from headers
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) {
        this.disconnect(client, 'No authorization token provided');
        return;
      }

      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token);
      
      if (!payload || !payload.sub) {
        this.disconnect(client, 'Invalid token');
        return;
      }

      // Store client connection with user ID
      this.connectedClients.set(client.id, payload.sub);
      
      this.logger.log(`Client connected: ${client.id}, User ID: ${payload.sub}`);
    } catch (error) {
      this.disconnect(client, 'Authentication failed');
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:tasks')
  handleJoinTasks(@ConnectedSocket() client: Socket) {
    client.join('tasks');
    this.logger.log(`Client ${client.id} joined tasks room`);
    return { event: 'joined', data: 'Successfully joined tasks room' };
  }

  // Notify about new task
  notifyNewTask(task: any) {
    this.server.to('tasks').emit('task:created', task);
  }

  // Notify about task update
  notifyTaskUpdate(task: any) {
    this.server.to('tasks').emit('task:updated', task);
  }

  // Notify task creator about completion
  notifyTaskCompletion(task: any) {
    // Find all socket IDs for the creator
    const creatorSocketIds = Array.from(this.connectedClients.entries())
      .filter(([_, userId]) => userId === task.creatorId)
      .map(([socketId]) => socketId);

    // Send notification to all creator's connected devices
    creatorSocketIds.forEach(socketId => {
      this.server.to(socketId).emit('task:completed', {
        taskId: task.id,
        title: task.title,
        completedBy: task.assignee?.username || 'Someone',
        completedAt: new Date(),
      });
    });
  }

  private disconnect(client: Socket, reason: string) {
    client.emit('error', { message: reason });
    client.disconnect();
    this.logger.error(`Client disconnected: ${client.id}, Reason: ${reason}`);
  }
} 