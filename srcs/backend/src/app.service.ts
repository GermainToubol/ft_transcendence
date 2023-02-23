import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!<form action="http://localhost:3000/auth/" method="GET"><button>coucou</button></form>';
    }
}
