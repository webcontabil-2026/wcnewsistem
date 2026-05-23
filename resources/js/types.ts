/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "CLIENT" | "ACCOUNTANT" | "ADMIN";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    razaoSocial?: string;
    cpf?: string;
    cnpj?: string;
    crc?: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface Task {
    id: string;
    title: string;
    dueDate: string;
    status: "PENDING" | "COMPLETED" | "IN_PROGRESS";
    clientName?: string;
}

export interface ReportData {
    month: string;
    value: number;
}
