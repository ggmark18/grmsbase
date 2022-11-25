import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthUser, UserRole } from '../../../api-dto/common/users/dto.users';

@Injectable()
export class UsersService {
    constructor(private http : HttpClient) {}

    allUsers(target) : Observable<AuthUser[]> {
	    return this.http.get<AuthUser[]>(`/api/users/${target}`);
    }

    allAdminUsers() : Observable<AuthUser[]> {
	    return this.http.get<AuthUser[]>(`/api/users/role/${UserRole.ADMIN}`);
    }


    deleteUser(user) : Observable<void> {
	    return this.http.delete<void>(`/api/users/${user._id}`);
    }
    
    updateUser(user) : Observable<AuthUser> {
	    return this.http.put<AuthUser>(`/api/users/${user._id}`, user);
    }

    createUser(user) : Observable<AuthUser> {
	    return this.http.post<AuthUser>(`/api/users`, user);
    }

    changePassword(password) : Observable<void> {
        return this.http.post<void>('/api/users/password', { password:password});
    }

}
