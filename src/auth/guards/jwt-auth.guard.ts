import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      // For public routes, bypass authentication entirely
      // This prevents 403 errors when invalid tokens are sent
      return true;
    }
    
    return super.canActivate(context);
  }

  // Override handleRequest to prevent errors on public routes
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If route is public, ignore authentication errors
    if (isPublic) {
      return user || null;
    }
    
    // For protected routes, use default behavior
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}

