export function formPriority(priority: string): string{
    const priorityMap : Record<string, string> = {
        High:'🔴 High Priority',
        Medium:'🟡 Medium Priority',
        Low:'🟢 Low Priority'
    };

    return priorityMap[priority] ||priority;
}


export function formatType(type: string): string {
    const typeMap : Record<string, string> = {
        Bug:'🐞 Bug Fix',
        Feature: '✨ New Feature',
        Enhancement: '⚙️ Enhancement',
        Documentation:'📄 Documentation',
        Security:'🛡️ Security',
        DevOps:'☁️ DevOps',
        Testing:'💻 Testing'
    };

    return typeMap[type] || type;
}