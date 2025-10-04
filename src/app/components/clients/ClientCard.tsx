import Link from "next/link";
import { Building, Mail, Phone, User } from "lucide-react";

import { Client } from "@/lib/types";

interface ClientCardProps {
    client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
    return (
        <div className="bg-background-secondary rounded-lg shadow-md p-6 flex flex-col space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-bold text-foreground-primary flex items-center space-x-2">
                <Building size={20} className="text-primary" />
                <Link href={`/dashboard/clients/${client.id}`} className="hover:text-primary-hover transition-colors duration-200">
                    {client.name}
                </Link>
            </h2>
            {client.contactPerson && (
                <p className="text-foreground-secondary flex items-center space-x-2">
                    <User size={16} className="text-secondary" />
                    <span>{client.contactPerson}</span>
                </p>
            )}
            {client.email && (
                <p className="text-foreground-secondary flex items-center space-x-2">
                    <Mail size={16} className="text-secondary" />
                    <a href={`mailto:${client.email}`} className="hover:text-primary-hover transition-colors duration-200">
                        {client.email}
                    </a>
                </p>
            )}
            {client.phone && (
                <p className="text-foreground-secondary flex items-center space-x-2">
                    <Phone size={16} className="text-secondary" />
                    <a href={`tel:${client.phone}`} className="hover:text-primary-hover transition-colors duration-200">
                        {client.phone}
                    </a>
                </p>
            )}
            <div className="mt-auto flex justify-end pt-4 border-t border-gray-100">
                <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="text-sm font-medium text-primary hover:underline transition-colors duration-200"
                >
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
}