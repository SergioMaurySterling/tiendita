// tslint:disable-next-line: class-name
export interface usersM {
  uid?: string;
  imageUrl?: string;
  email?: string;
  name?: string;
  lastname?: string;
  phone?: string;
  password?: string;
  rol?: string;
  date?: string;
}

export interface UsersE {
  uid?: string;
  imageUrl?: string;
  email?: string;
  password?: string;
  name?: string;
  lastname?: string;
  nit?: string;
  phone?: string;
  googleDir?: string;
  latitude?: number;
  longitude?: number;
  direction?: string;
  delivery?: number;
  description?: string;
  horario?: string;
  website?: string;
  rol?: string;
  isActive?: boolean;
  rate?: number;
  date?: string;

  petImage?: string;
  petName?: string;
  petSize?: string;
  petRace?: string;
  petAge?: string;
  petFur?: string;
  petObservations?: string;
}
