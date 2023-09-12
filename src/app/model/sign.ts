import { Patient } from "./patient";

export class Sign {
    idSign: number;
    temperature: string;
    pulse: string;
    rate: string;
    createdAt: string;
    patient: Patient
}