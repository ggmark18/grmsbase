import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '@api-dto/common/users/dto';
import { AuthRole } from '@api-dto/common/auth/dto';

@Injectable()
export class UsersService {
    constructor(private http : HttpClient) {}

    allUsers() : Observable<User[]> {
	    return this.http.get<User[]>(`/api/users/`);
    }
    
    deleteUser(user) : Observable<void> {
	    return this.http.delete<void>(`/api/users/${user._id}`);
    }
    
    updateUser(user) : Observable<User> {
	    return this.http.put<User>(`/api/users/${user._id}`, user);
    }

    createUser(user) : Observable<User> {
	    return this.http.post<User>(`/api/users`, user);
    }

    changePassword(password) : Observable<void> {
        return this.http.post<void>('/api/users/password', { password:password});
    }

}
