import { BadRequestException, CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class IsAdmind implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const role = request.role
        console.log(role, "role")
        if(role !== 'admin'){
            throw new BadRequestException('Permition dinied')
        }
        return true
    }
}

