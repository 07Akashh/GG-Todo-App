export interface GroupedTasks {
  groupLabel: string;
  tasks: any[];
  date: Date;
}

export function groupTasksByDate(tasks: any[]): GroupedTasks[] {
  if (!tasks || tasks.length === 0) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Group tasks by date
  const grouped = new Map<string, any[]>();

  tasks.forEach((task) => {
    if (!task.dueDate) {
      // Tasks without due date go to "No Date"
      const key = 'no-date';
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(task);
      return;
    }

    const taskDate = new Date(task.dueDate);
    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

    let groupKey: string;
    let groupLabel: string;
    let groupDate: Date;

    if (taskDateOnly.getTime() === today.getTime()) {
      groupKey = 'today';
      groupLabel = 'Today';
      groupDate = today;
    } else if (taskDateOnly.getTime() === yesterday.getTime()) {
      groupKey = 'yesterday';
      groupLabel = 'Yesterday';
      groupDate = yesterday;
    } else if (taskDateOnly.getTime() === tomorrow.getTime()) {
      groupKey = 'tomorrow';
      groupLabel = 'Tomorrow';
      groupDate = tomorrow;
    } else {
      // Format date for other dates
      const dateStr = taskDateOnly.toISOString().split('T')[0];
      groupKey = dateStr;
      groupLabel = formatDateLabel(taskDateOnly);
      groupDate = taskDateOnly;
    }

    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }
    grouped.get(groupKey)!.push(task);
  });

  // Convert to array and sort
  const groups: GroupedTasks[] = Array.from(grouped.entries()).map(([key, tasks]) => {
    let date: Date;
    let label: string;

    if (key === 'today') {
      date = today;
      label = 'Today';
    } else if (key === 'yesterday') {
      date = yesterday;
      label = 'Yesterday';
    } else if (key === 'tomorrow') {
      date = tomorrow;
      label = 'Tomorrow';
    } else if (key === 'no-date') {
      date = new Date(0); // Sort to end
      label = 'No Date';
    } else {
      date = new Date(key);
      label = formatDateLabel(date);
    }

    return {
      groupLabel: label,
      tasks: tasks.sort((a, b) => {
        // Sort tasks within group by due date time, then by title
        if (a.dueDate && b.dueDate) {
          const timeA = new Date(a.dueDate).getTime();
          const timeB = new Date(b.dueDate).getTime();
          if (timeA !== timeB) return timeA - timeB;
        }
        return a.title.localeCompare(b.title);
      }),
      date,
    };
  });

  // Sort groups: Today, Yesterday, Tomorrow, then future dates, then past dates, then no date
  groups.sort((a, b) => {
    // Today first
    if (a.groupLabel === 'Today') return -1;
    if (b.groupLabel === 'Today') return 1;

    // Yesterday second
    if (a.groupLabel === 'Yesterday') return -1;
    if (b.groupLabel === 'Yesterday') return 1;

    // Tomorrow third
    if (a.groupLabel === 'Tomorrow') return -1;
    if (b.groupLabel === 'Tomorrow') return 1;

    // No date last
    if (a.groupLabel === 'No Date') return 1;
    if (b.groupLabel === 'No Date') return -1;

    // Sort by date (future dates before past dates)
    const todayTime = today.getTime();
    const aTime = a.date.getTime();
    const bTime = b.date.getTime();

    const aIsFuture = aTime >= todayTime;
    const bIsFuture = bTime >= todayTime;

    if (aIsFuture && !bIsFuture) return -1;
    if (!aIsFuture && bIsFuture) return 1;

    // Both future or both past - sort by date (ascending for future, descending for past)
    if (aIsFuture) {
      return aTime - bTime; // Future: earliest first
    } else {
      return bTime - aTime; // Past: most recent first
    }
  });

  return groups;
}

function formatDateLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = dateOnly.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 1) return 'Tomorrow';

  // Format as "Mon, Jan 15" or "Jan 15, 2025" for other years
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }

  return date.toLocaleDateString('en-US', options);
}

