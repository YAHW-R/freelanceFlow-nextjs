'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateGoalStatus } from '@/app/actions/projectsActions';
import type { Goal } from '@/lib/types';
import { CheckCircle, Circle } from 'lucide-react';

interface GoalItemProps {
    goal: Goal;
    projectId: string;
}

export default function GoalItem({ goal, projectId }: GoalItemProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        startTransition(async () => {
            await updateGoalStatus(goal.id, !goal.is_complete, projectId);
            router.refresh(); // Recarga los datos del servidor para reflejar el cambio
        });
    };

    return (
        <li
            className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${goal.is_complete ? 'bg-green-50' : 'bg-gray-50'}`}
        >
            <button
                onClick={handleToggle}
                disabled={isPending}
                className="flex-shrink-0 disabled:opacity-50"
            >
                {goal.is_complete ? (
                    <CheckCircle size={20} className="text-green-500 mt-1" />
                ) : (
                    <Circle size={20} className="text-gray-400 mt-1" />
                )}
            </button>
            <div>
                <p className={`font-semibold ${goal.is_complete ? 'text-gray-500 line-through' : 'text-foreground-primary'}`}>
                    {goal.name}
                </p>
                {goal.description && (
                    <p className="text-sm text-foreground-secondary">{goal.description}</p>
                )}
                {isPending && <span className="text-xs text-gray-500">Actualizando...</span>}
            </div>
        </li>
    );
}
