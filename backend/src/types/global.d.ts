// Global type declarations for modules that might have missing type definitions

// Define specific exports for @nestjs/config
declare module '@nestjs/config' {
  export class ConfigService {
    get<T>(propertyPath: string, defaultValue?: T): T;
  }
  
  export class ConfigModule {
    static forRoot(options?: any): any;
  }
}

// Define specific exports for socket.io
declare module 'socket.io' {
  export class Socket {
    id: string;
    handshake: any;
    join(room: string): void;
    emit(event: string, data: any): void;
    disconnect(): void;
  }
  
  export class Server {
    to(room: string): any;
  }
}

// Only declare modules without specific type requirements
declare module '@nestjs/common';
declare module '@nestjs/typeorm';
declare module '@nestjs/core';
declare module '@nestjs/platform-express';
declare module '@nestjs/swagger';
declare module '@nestjs/jwt';
declare module '@nestjs/passport';
declare module '@nestjs/websockets';
declare module '@nestjs/platform-socket.io';
declare module 'passport-jwt';
declare module 'passport-local';
declare module 'bcrypt';
declare module 'class-validator';
declare module 'class-transformer';

// Add declarations for local modules if needed
declare module './modules/auth/auth.module';
declare module './modules/tasks/tasks.module';
declare module './modules/users/users.module';
declare module './modules/events/events.module';
declare module './modules/events/events.gateway';
declare module './modules/tasks/entities/task.entity';
declare module './modules/users/entities/user.entity'; 