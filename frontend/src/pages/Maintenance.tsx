import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { maintenanceTasks, SEVERITY_COLORS } from '../data/mockData';
import type { DefectStatus, MaintenanceTask } from '../types';

const COLUMNS: { status: DefectStatus; label: string; color: string }[] = [
  { status: 'OPEN', label: 'Open', color: 'var(--color-high)' },
  { status: 'ACKNOWLEDGED', label: 'Acknowledged', color: 'var(--color-info)' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'var(--color-medium)' },
  { status: 'RESOLVED', label: 'Resolved', color: 'var(--color-low)' },
];

function TaskCard({ task, onClick }: { task: MaintenanceTask; onClick: () => void }) {
  const deadlineDate = new Date(task.deadline);
  const isOverdue = deadlineDate < new Date() && task.status !== 'RESOLVED';

  return (
    <div
      className="panel cursor-pointer transition-colors"
      onClick={onClick}
      style={{ borderLeft: `3px solid ${SEVERITY_COLORS[task.severity]}`, padding: '12px' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>{task.id}</span>
        <span className={`badge badge-${task.severity.toLowerCase()}`} style={{ fontSize: '9px', padding: '1px 6px' }}>{task.severity}</span>
      </div>
      <h4 className="text-body-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
        {task.defect_type}
      </h4>
      <p className="text-label-mono mb-3" style={{ color: 'var(--color-text-muted)', fontSize: '10px', textTransform: 'none' }}>
        {task.section}
      </p>
      <div className="flex flex-col gap-1.5">
        {task.assigned_to && (
          <div className="flex items-center gap-1.5">
            <User size={12} style={{ color: 'var(--color-text-dim)' }} />
            <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
              {task.assigned_to}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock size={12} style={{ color: isOverdue ? 'var(--color-critical)' : 'var(--color-text-dim)' }} />
          <span className="text-body-sm" style={{ color: isOverdue ? 'var(--color-critical)' : 'var(--color-text-secondary)', fontSize: '12px' }}>
            {deadlineDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
      </div>
      {task.notes && (
        <p className="text-body-sm mt-2 pt-2" style={{ color: 'var(--color-text-dim)', fontSize: '11px', borderTop: '1px solid var(--color-border)' }}>
          {task.notes}
        </p>
      )}
    </div>
  );
}

export default function Maintenance() {
  const navigate = useNavigate();
  const [tasks] = useState(maintenanceTasks);

  const tasksByStatus = (status: DefectStatus) => tasks.filter(t => t.status === status);

  return (
    <>
      <TopBar title="Maintenance Command Center" />
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
              {tasks.length} TASKS
            </span>
            <span className="text-label-mono" style={{ color: 'var(--color-critical)', fontSize: '11px' }}>
              {tasks.filter(t => t.severity === 'CRITICAL' && t.status !== 'RESOLVED').length} CRITICAL
            </span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {COLUMNS.map(({ status, label, color }) => {
            const columnTasks = tasksByStatus(status);
            return (
              <div key={status} className="flex flex-col">
                {/* Column Header */}
                <div
                  className="flex items-center justify-between rounded-t px-3 py-2 mb-2"
                  style={{ backgroundColor: 'var(--color-surface-container)', borderBottom: `2px solid ${color}` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-label-mono" style={{ color: 'var(--color-text-primary)', fontSize: '11px' }}>{label}</span>
                  </div>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded text-xs font-semibold"
                    style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 min-h-[200px]">
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => navigate(`/defects/${task.defect_id}`)}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center py-8 rounded" style={{ border: '1px dashed var(--color-border)', color: 'var(--color-text-dim)' }}>
                      <span className="text-body-sm">No tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
