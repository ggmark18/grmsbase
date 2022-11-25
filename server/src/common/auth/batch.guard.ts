import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as os from 'os';

@Injectable()
export class BatchGuard implements CanActivate {
    hostip = undefined;
    constructor() {
	    var ifaces = os.networkInterfaces();
        Object.keys(ifaces).forEach( (ifname) => {
            ifaces[ifname].forEach( (iface) => {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                if ( ifname == "eth0" ) {
                    let thisip = iface.address;
                    this.hostip = thisip.replace(/\.[0-9]+$/, '.1');
                }
            });
        });
    }
    canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {
	    const request = context.switchToHttp().getRequest();
        let pip = '::ffff:'+this.hostip;
        if ( request.ip == '::1' || request.ip == pip ) {
            return true;
        } else {
	        throw new UnauthorizedException();
        }
    }
}

