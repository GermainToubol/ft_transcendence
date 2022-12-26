import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!<form action="http://transcendence.42.fr:3000/auth/login" method="POST"><button>coucou</button></form>';
    }
}
