const inspectionData = {
    water: [
        { id: 1, item: "QUALITY OF SOURCE WATER" },
        { id: 2, item: "QUALITY OF REFILLED/PRODUCT WATER" },
        { id: 3, item: "PROTECTION OF PRODUCT WATER" },
        { id: 4, item: "WATER PURIFICATION PROCESS" },
        { id: 5, item: "FILLING AND CAPPING" },
        { id: 6, item: "CONTAINERS CAPS AND DISPENSERS" },
        { id: 7, item: "WASHING AND SANITIZING" },
        { id: 8, item: "STORAGE OF WATER" },
        { id: 9, item: "TRANSPORT OF PRODUCT WATER" },
        { id: 10, item: "ROOM/FACILITY AREA ALLOCATION" },
        { id: 11, item: "CONSTRUCTION OF PREMISES" },
        { id: 12, item: "MAINTENANCE OF PREMISES" },
        { id: 13, item: "TOILET FACILITIES" },
        { id: 14, item: "HANDWASHING FACILITIES" },
        { id: 15, item: "SANITARY PLUMBING" },
        { id: 16, item: "LIQUID WASTE MANAGEMENT" },
        { id: 17, item: "SOLID WASTE MANAGEMENT" },
        { id: 18, item: "VERMIN CONTROL" },
        { id: 19, item: "PERSONNEL REQUIREMENTS" },
        { id: 20, item: "MISCELLANEOUS" }
    ],
    food: [
        { id: 1, item: "PLANNING & ESTIMABLE" },
        { id: 2, item: "FOOD PROTECTION" },
        { id: 3, item: "KITCHEN" },
        { id: 4, item: "CONSTRUCTION OF PREMISES" },
        { id: 5, item: "MAINTENANCE OF PREMISES" },
        { id: 6, item: "TOILET PROVISION" },
        { id: 7, item: "HANDWASHING FACILITIES" },
        { id: 8, item: "WATER SUPPLY" },
        { id: 9, item: "LIQUID WASTE MANAGEMENT" },
        { id: 10, item: "SOLID WASTE MANAGEMENT" },
        { id: 11, item: "WHOLESOMENESS OF FOOD" },
        { id: 12, item: "PROTECTION OF FOOD" },
        { id: 13, item: "VERMIN CONTROL" },
        { id: 14, item: "CLEANLINESS AND TIDINESS" },
        { id: 15, item: "PERSONAL CLEANLINESS" },
        { id: 16, item: "HOUSEKEEPING AND MANAGEMENT" },
        { id: 17, item: "CONDITIONS APPLIANCES & UTENSILS" },
        { id: 18, item: "SANITARY CONDITIONS OF APPLIANCES" },
        { id: 19, item: "DISEASE CONTROL" },
        { id: 20, item: "MISCELLANEOUS" }
    ]
};

const ratingScale = {
    excellent: { min: 90, max: 100, label: "Excellent", color: "success" },
    verySatisfactory: { min: 70, max: 89, label: "Very Satisfactory", color: "info" },
    satisfactory: { min: 50, max: 69, label: "Satisfactory", color: "warning" },
    poor: { min: 0, max: 49, label: "Poor", color: "danger" }
};

let mockDatabase = {
    inspections: getFromLocalStorage('inspections') || [
        {
            id: 1,
            date: "2024-11-15",
            establishment: "Joya Water Refilling Station",
            owner: "Ronald dela Cruz",
            address: "Poblacion, Maragondon",
            type: "water",
            inspector: "Maria Santos",
            rating: 85,
            status: "passed",
            demerits: 3
        },
        {
            id: 2,
            date: "2024-11-14",
            establishment: "CvB Pizza",
            owner: "Omiana Buenecye",
            address: "Barangay A",
            type: "food",
            inspector: "John Reyes",
            rating: 78,
            status: "passed",
            demerits: 5
        },
        {
            id: 3,
            date: "2024-11-13",
            establishment: "Pure Water Station",
            owner: "Juan Dela Rosa",
            address: "Paliparan, Maragondon",
            type: "water",
            inspector: "Maria Santos",
            rating: 92,
            status: "excellent",
            demerits: 1
        }
    ],
    events: getFromLocalStorage('events') || [
        {
            id: 1,
            title: "Water Quality Inspection - Barangay Poblacion",
            date: "2024-11-20",
            type: "Water Station Inspection",
            description: "Regular sanitary inspection of all water refilling stations"
        }
    ],
    users: getFromLocalStorage('users') || [
        { id: 1, username: "admin", password: "password", name: "Maria Santos" }
    ]
};

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateTimeString = now.toLocaleDateString('en-US', options);
    const element = document.getElementById('current-date-time');
    if (element) {
        element.textContent = dateTimeString;
    }
}

function calculateRating(totalDemerits) {
    const rating = 100 - totalDemerits;
    return Math.max(0, Math.min(100, rating));
}

function getRatingLabel(percentage) {
    if (percentage >= ratingScale.excellent.min) return ratingScale.excellent.label;
    if (percentage >= ratingScale.verySatisfactory.min) return ratingScale.verySatisfactory.label;
    if (percentage >= ratingScale.satisfactory.min) return ratingScale.satisfactory.label;
    return ratingScale.poor.label;
}

function getRatingColor(percentage) {
    if (percentage >= ratingScale.excellent.min) return "success";
    if (percentage >= ratingScale.verySatisfactory.min) return "info";
    if (percentage >= ratingScale.satisfactory.min) return "warning";
    return "danger";
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function exportToCSV(filename, data) {
    if (!data || data.length === 0) {
        showCustomAlert('No data to export.');
        return;
    }
    let csv = [];
    const headers = Object.keys(data[0]);
    csv.push(headers.join(','));
    
    data.forEach(row => {
        csv.push(headers.map(header => JSON.stringify(row[header])).join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function printForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Inspection Report</title>');
    printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
    printWindow.document.write('<style>body { font-size: 12px; padding: 20px; } table { width: 100%; } .form-section-title { font-size: 1rem; font-weight: 700; color: #1b7d3d; margin-bottom: 15px; text-transform: uppercase; } .rating-display { font-size: 1.5rem; font-weight: 700; padding: 10px; border-radius: 8px; background-color: #f8f9fa; } </style>');
    printWindow.document.write('</head><body>');
    
    const title = formId === 'water-form' ? 'Sanitary Inspection of Water Refilling Station' : 'Sanitary Inspection of Food Establishment';
    printWindow.document.write(`<h2>${title}</h2><hr>`);
    
    const elements = form.elements;
    let html = '<div class="container-fluid">';

    html += '<div class="form-section-title">Station Information</div>';
    html += '<div class="row mb-3">';
    html += `<div class="col-6"><strong>Name:</strong> ${elements.stationName?.value || elements.establishmentName?.value}</div>`;
    html += `<div class="col-6"><strong>Address:</strong> ${elements.address?.value}</div>`;
    html += `<div class="col-6"><strong>Owner:</strong> ${elements.owner?.value}</div>`;
    html += `<div class="col-6"><strong>Tel. No:</strong> ${elements.phone?.value || 'N/A'}</div>`;
    html += `<div class="col-6"><strong>Inspector:</strong> ${elements.inspector?.value}</div>`;
    html += `<div class="col-6"><strong>Date:</strong> ${elements.inspectionDate?.value}</div>`;
    html += '</div>';

    html += '<div class="form-section-title mt-4">Inspection Items</div>';
    const itemsBody = form.id.includes('water') ? document.getElementById('water-items-body') : document.getElementById('food-items-body');
    html += '<table class="table table-bordered">';
    html += '<thead class="table-light"><tr><th>Item</th><th>Demerits</th><th>Notes</th></tr></thead><tbody>';
    
    itemsBody.querySelectorAll('tr').forEach(row => {
        const item = row.cells[1].innerText;
        const demerits = row.querySelector('input[type="number"]').value;
        const notes = row.querySelector('input[type="text"]').value;
        if (demerits > 0 || notes) {
             html += `<tr><td>${item}</td><td>${demerits}</td><td>${notes}</td></tr>`;
        }
    });
    html += '</tbody></table>';

    html += '<div class="form-section-title mt-4">Summary</div>';
    html += '<div class="row">';
    const totalDemerits = form.id.includes('water') ? document.getElementById('water-total-demerits').value : document.getElementById('food-total-demerits').value;
    const rating = form.id.includes('water') ? document.getElementById('water-rating').textContent : document.getElementById('food-rating').textContent;
    
    html += `<div class="col-6"><strong>Total Demerits:</strong> ${totalDemerits}</div>`;
    html += `<div class="col-6"><strong>Sanitation Rating:</strong> ${rating}</div>`;
    html += '</div>';
    
    html += '<div class="mt-4">';
    html += `<strong>Recommended Corrective Measures:</strong>`;
    html += `<p>${elements.recommendations?.value || 'N/A'}</p>`;
    html += '</div>';

    html += '</div>';
    
    printWindow.document.write(html);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

function showCustomAlert(message, type = 'success') {
    const alertModal = new bootstrap.Modal(document.getElementById('alertModal') || createAlertModal());
    
    const modalBody = document.getElementById('alertModalBody');
    const modalHeader = document.getElementById('alertModalHeader');
    
    modalBody.textContent = message;
    modalHeader.classList.remove('bg-success', 'bg-danger', 'bg-warning');
    
    if (type === 'success') {
        modalHeader.classList.add('bg-success');
    } else if (type === 'error') {
        modalHeader.classList.add('bg-danger');
    } else {
        modalHeader.classList.add('bg-warning');
    }
    
    alertModal.show();
}

function createAlertModal() {
    const modalHTML = `
    <div class="modal fade" id="alertModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header text-white" id="alertModalHeader">
            <h5 class="modal-title">System Message</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="alertModalBody">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('alertModal');
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('current-date-time')) {
        updateDateTime();
        setInterval(updateDateTime, 60000);
    }
    
    const currentUser = getFromLocalStorage('currentUser');
    const onLoginPage = document.getElementById('login-form');
    
    if (!currentUser && !onLoginPage) {
        window.location.href = 'login.html';
        return;
    }

    if (document.getElementById('recent-inspections-body')) {
        loadRecentInspections();
    }
    if (document.getElementById('sanitationChart')) {
        initializeDashboardCharts();
    }
    
    if (document.getElementById('activities-grid')) {
        loadActivities();
        setupSearch();
    }
    
    if (document.getElementById('calendar')) {
        renderCalendar();
        loadUpcomingEvents();
        document.getElementById('prev-month')?.addEventListener('click', previousMonth);
        document.getElementById('next-month')?.addEventListener('click', nextMonth);
        document.getElementById('add-event-btn')?.addEventListener('click', addCalendarEvent);
    }
    
    if (document.getElementById('water-form-section')) {
        setupFormTypeToggle();
        populateInspectionItems();
        
        const waterForm = document.getElementById('water-form');
        const foodForm = document.getElementById('food-form');
        
        waterForm?.addEventListener('submit', handleWaterSubmit);
        foodForm?.addEventListener('submit', handleFoodSubmit);
        
        waterForm?.addEventListener('reset', () => setTimeout(calculateWaterRating, 0));
        foodForm?.addEventListener('reset', () => setTimeout(calculateFoodRating, 0));
        
        if (currentUser) {
            const waterInspector = document.getElementById('water-inspector-name');
            const foodInspector = document.getElementById('food-inspector-name');
            if (waterInspector) waterInspector.value = currentUser.name;
            if (foodInspector) foodInspector.value = currentUser.name;
        }
    }
    
    if (document.getElementById('statusChart')) {
        loadMetrics();
        initializeReportCharts();
        loadRecords();
        document.getElementById('apply-filters-btn')?.addEventListener('click', applyFilters);
    }

    if (onLoginPage) {
        setupAuthForms();
    }
    
    document.getElementById('logout-button')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
    
    createAlertModal();
    
    document.getElementById('approveActivityBtn')?.addEventListener('click', approveActivity);
});

let sanitationChart, waterQualityChart;

function loadRecentInspections() {
    const tbody = document.getElementById('recent-inspections-body');
    if (!tbody) return;
    const inspections = [...mockDatabase.inspections].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    tbody.innerHTML = inspections.map(inspection => `
        <tr>
            <td><strong>${inspection.establishment}</strong></td>
            <td>
                <span class="badge ${inspection.type === 'water' ? 'bg-info' : 'bg-success'}">
                    ${inspection.type === 'water' ? 'Water Station' : 'Food Establishment'}
                </span>
            </td>
            <td>${new Date(inspection.date).toLocaleDateString()}</td>
            <td>
                <span class="badge bg-${getRatingColor(inspection.rating)}">${inspection.rating}%</span>
            </td>
            <td>
                <span class="badge bg-${inspection.status === 'passed' ? 'success' : 'warning'}">
                    ${inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-success" onclick="viewInspection(${inspection.id})">
                    View
                </button>
            </td>
        </tr>
    `).join('');
}

function initializeDashboardCharts() {
    const sanitationCtx = document.getElementById('sanitationChart');
    if (!sanitationCtx) return;
    
    if (sanitationChart) sanitationChart.destroy();
    sanitationChart = new Chart(sanitationCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Excellent', 'Very Satisfactory', 'Satisfactory', 'Poor'],
            datasets: [{
                data: [
                    mockDatabase.inspections.filter(i => getRatingLabel(i.rating) === 'Excellent').length,
                    mockDatabase.inspections.filter(i => getRatingLabel(i.rating) === 'Very Satisfactory').length,
                    mockDatabase.inspections.filter(i => getRatingLabel(i.rating) === 'Satisfactory').length,
                    mockDatabase.inspections.filter(i => getRatingLabel(i.rating) === 'Poor').length,
                ],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#dc3545'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    const waterCtx = document.getElementById('waterQualityChart');
    if (!waterCtx) return;
    
    if (waterQualityChart) waterQualityChart.destroy();
    waterQualityChart = new Chart(waterCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
                {
                    label: 'Average Quality Score',
                    data: [85, 87, 86, 89, 91],
                    borderColor: '#1b7d3d',
                    backgroundColor: 'rgba(27, 125, 61, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 80,
                    max: 100
                }
            }
        }
    });
}

function viewInspection(id) {
    const inspection = mockDatabase.inspections.find(i => i.id === id);
    if (inspection) {
        showCustomAlert(`
Inspection Details:
Establishment: ${inspection.establishment}
Date: ${new Date(inspection.date).toLocaleDateString()}
Rating: ${inspection.rating}%
Inspector: ${inspection.inspector}
Status: ${inspection.status}
        `, 'info');
    }
}

let currentFilter = 'all';

function setupSearch() {
    const searchInput = document.getElementById('activity-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadActivities(this.value);
        });
    }
}

function loadActivities(searchTerm = '') {
    const grid = document.getElementById('activities-grid');
    if (!grid) return;
    let activities = mockDatabase.inspections;
    
    if (currentFilter !== 'all') {
        activities = activities.filter(a => {
            if (currentFilter === 'water') return a.type === 'water';
            if (currentFilter === 'food') return a.type === 'food';
            if (currentFilter === 'upcoming') return new Date(a.date) > new Date();
            return true;
        });
    }
    
    if (searchTerm) {
        activities = activities.filter(a => 
            a.establishment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.owner.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (activities.length === 0) {
        grid.innerHTML = '<p class="text-dark-emphasis">No activities found matching your criteria.</p>';
        return;
    }
    
    grid.innerHTML = activities.map(activity => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="activity-card" onclick="showActivityDetails(${activity.id})">
                <div class="activity-image">
                    ${activity.type === 'water' ? '💧' : '🍽️'}
                </div>
                <div class="activity-content">
                    <h6 class="activity-title">${activity.establishment}</h6>
                    <p class="activity-meta">
                        <i class="bi bi-calendar"></i> ${new Date(activity.date).toLocaleDateString()}
                    </p>
                    <p class="activity-meta">
                        <i class="bi bi-person"></i> ${activity.owner}
                    </p>
                    <span class="activity-status ${activity.rating >= 85 ? 'excellent' : 'satisfactory'}">
                        ${activity.rating}% - ${getRatingLabel(activity.rating)}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterActivities(type) {
    currentFilter = type;
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.btn-group .btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick') === `filterActivities('${type}')`) {
            btn.classList.add('active');
        }
    });
    
    loadActivities(document.getElementById('activity-search')?.value || '');
}


function showActivityDetails(id) {
    const activity = mockDatabase.inspections.find(a => a.id === id);
    if (activity) {
        const modalContent = document.getElementById('modalContent');
        if (!modalContent) return;
        modalContent.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Establishment</h6>
                    <p>${activity.establishment}</p>
                </div>
                <div class="col-md-6">
                    <h6>Owner</h6>
                    <p>${activity.owner}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <h6>Date</h6>
                    <p>${new Date(activity.date).toLocaleDateString()}</p>
                </div>
                <div class="col-md-6">
                    <h6>Inspector</h6>
                    <p>${activity.inspector}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <h6>Address</h6>
                    <p>${activity.address}</p>
                </div>
                <div class="col-md-6">
                    <h6>Rating</h6>
                    <p><span class="badge bg-${getRatingColor(activity.rating)}">${activity.rating}%</span></p>
                </div>
            </div>
        `;
        new bootstrap.Modal(document.getElementById('activityModal')).show();
    }
}

function approveActivity() {
    showCustomAlert('Activity approved successfully!');
    bootstrap.Modal.getInstance(document.getElementById('activityModal')).hide();
}

let currentDate = new Date();
let calendarEvents = mockDatabase.events;
let eventDetailsModal;

function renderCalendar() {
    const calendarContainer = document.getElementById('calendar');
    if (!calendarContainer) return;
    
    if (!eventDetailsModal) {
        eventDetailsModal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
    }
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('current-month').textContent = monthName;
    
    let calendarHTML = '';
    
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day-header fw-bold text-center">${day}</div>`;
    });
    
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += '<div class="calendar-day other-month"></div>';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayDate = new Date(year, month, day);
        
        const isToday = dayDate.getTime() === today.getTime();
        const dayEvents = calendarEvents.filter(e => e.date === dateStr);
        
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-event' : ''}" 
                 onclick="showDayEvents('${dateStr}')">
                ${day}
            </div>
        `;
    }
    
    calendarContainer.innerHTML = calendarHTML;
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function loadUpcomingEvents() {
    const upcomingContainer = document.getElementById('upcoming-events');
    if (!upcomingContainer) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const upcomingEvents = calendarEvents
        .filter(e => {
            const eventDate = new Date(e.date);
            eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset()); // Adjust for UTC
            return eventDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    if (upcomingEvents.length === 0) {
        upcomingContainer.innerHTML = '<div class="p-3 text-dark-emphasis">No upcoming events.</div>';
        return;
    }
    
    upcomingContainer.innerHTML = upcomingEvents.map(event => `
        <div class="p-3 border-bottom">
            <strong>${event.title}</strong>
            <p class="text-dark-emphasis small mb-1">${new Date(event.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
            <span class="badge bg-success">${event.type}</span>
        </div>
    `).join('');
}

function showDayEvents(dateStr) {
    const dayEvents = calendarEvents.filter(e => e.date === dateStr);
    if (dayEvents.length > 0) {
        const modalBody = document.getElementById('eventDetailsBody');
        const formattedDate = new Date(dateStr);
        formattedDate.setMinutes(formattedDate.getMinutes() + formattedDate.getTimezoneOffset()); // Adjust for UTC
        
        modalBody.innerHTML = `
            <h6>Events on ${formattedDate.toLocaleDateString('en-US', { timeZone: 'UTC' })}</h6>
            <ul class="list-group">
                ${dayEvents.map(e => `
                    <li class="list-group-item">
                        <strong>${e.title}</strong><br>
                        <span class="badge bg-success">${e.type}</span>
                        <p class="small mt-1 mb-0">${e.description || ''}</p>
                    </li>
                `).join('')}
            </ul>
        `;
        eventDetailsModal.show();
    }
}

function addCalendarEvent() {
    const form = document.getElementById('event-form');
    const formData = new FormData(form);
    
    const event = {
        id: calendarEvents.length + 1,
        title: formData.get('title'),
        date: formData.get('date'),
        type: formData.get('type'),
        description: formData.get('description')
    };
    
    if (!event.title || !event.date || !event.type) {
        showCustomAlert("Please fill in all required fields.", "error");
        return;
    }
    
    calendarEvents.push(event);
    mockDatabase.events.push(event);
    saveToLocalStorage('events', calendarEvents);
    
    showCustomAlert('Event added successfully!');
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();
    renderCalendar();
    loadUpcomingEvents();
}

function setupFormTypeToggle() {
    document.querySelectorAll('input[name="formType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const waterSection = document.getElementById('water-form-section');
            const foodSection = document.getElementById('food-form-section');
            
            if (this.value === 'water') {
                waterSection.classList.remove('d-none');
                foodSection.classList.add('d-none');
            } else {
                waterSection.classList.add('d-none');
                foodSection.classList.remove('d-none');
            }
        });
    });
}

function populateInspectionItems() {
    const waterItemsBody = document.getElementById('water-items-body');
    if (waterItemsBody) {
        waterItemsBody.innerHTML = inspectionData.water.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.item}</td>
                <td>
                    <input type="number" class="form-control form-control-sm water-demerits" 
                           min="0" max="5" value="0" onchange="calculateWaterRating()">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" placeholder="Notes...">
                </td>
            </tr>
        `).join('');
    }

    const foodItemsBody = document.getElementById('food-items-body');
    if (foodItemsBody) {
        foodItemsBody.innerHTML = inspectionData.food.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.item}</td>
                <td>
                    <input type="number" class="form-control form-control-sm food-demerits" 
                           min="0" max="5" value="0" onchange="calculateFoodRating()">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" placeholder="Notes...">
                </td>
            </tr>
        `).join('');
    }
    
    calculateWaterRating();
    calculateFoodRating();
}

function calculateWaterRating() {
    const demeritsInputs = document.querySelectorAll('.water-demerits');
    let totalDemerits = 0;
    
    demeritsInputs.forEach(input => {
        totalDemerits += parseInt(input.value) || 0;
    });
    
    const totalDemeritsEl = document.getElementById('water-total-demerits');
    if (totalDemeritsEl) totalDemeritsEl.value = totalDemerits;
    
    const rating = calculateRating(totalDemerits);
    const ratingLabel = getRatingLabel(rating);
    const ratingEl = document.getElementById('water-rating');
    if (ratingEl) {
        ratingEl.textContent = `${rating}% - ${ratingLabel}`;
        ratingEl.className = `rating-display bg-${getRatingColor(rating)}-light text-dark`;
    }
}

function calculateFoodRating() {
    const demeritsInputs = document.querySelectorAll('.food-demerits');
    let totalDemerits = 0;
    
    demeritsInputs.forEach(input => {
        totalDemerits += parseInt(input.value) || 0;
    });
    
    const totalDemeritsEl = document.getElementById('food-total-demerits');
    if (totalDemeritsEl) totalDemeritsEl.value = totalDemerits;
    
    const rating = calculateRating(totalDemerits);
    const ratingLabel = getRatingLabel(rating);
    const ratingEl = document.getElementById('food-rating');
    if (ratingEl) {
        ratingEl.textContent = `${rating}% - ${ratingLabel}`;
        ratingEl.className = `rating-display bg-${getRatingColor(rating)}-light text-dark`;
    }
}

function handleWaterSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const totalDemerits = parseInt(document.getElementById('water-total-demerits').value);
    const rating = calculateRating(totalDemerits);
    
    const inspection = {
        id: mockDatabase.inspections.length + 1,
        date: formData.get('inspectionDate'),
        establishment: formData.get('stationName'),
        owner: formData.get('owner'),
        address: formData.get('address'),
        type: 'water',
        inspector: formData.get('inspector'),
        rating: rating,
        status: rating >= 70 ? 'passed' : 'failed',
        demerits: totalDemerits
    };
    
    mockDatabase.inspections.push(inspection);
    saveToLocalStorage('inspections', mockDatabase.inspections);
    
    showCustomAlert('Inspection submitted successfully!');
    event.target.reset();
    
    const currentUser = getFromLocalStorage('currentUser');
    if (currentUser) {
        document.getElementById('water-inspector-name').value = currentUser.name;
    }
    
    calculateWaterRating();
}

function handleFoodSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const totalDemerits = parseInt(document.getElementById('food-total-demerits').value);
    const rating = calculateRating(totalDemerits);
    
    const inspection = {
        id: mockDatabase.inspections.length + 1,
        date: formData.get('inspectionDate'),
        establishment: formData.get('establishmentName'),
        owner: formData.get('owner'),
        address: formData.get('address'),
        type: 'food',
        inspector: formData.get('inspector'),
        rating: rating,
        status: rating >= 70 ? 'passed' : 'failed',
        demerits: totalDemerits
    };
    
    mockDatabase.inspections.push(inspection);
    saveToLocalStorage('inspections', mockDatabase.inspections);
    
    showCustomAlert('Inspection submitted successfully!');
    event.target.reset();
    
    const currentUser = getFromLocalStorage('currentUser');
    if (currentUser) {
        document.getElementById('food-inspector-name').value = currentUser.name;
    }
    
    calculateFoodRating();
}

let reportStatusChart, reportTypeChart, reportTrendChart;

function loadMetrics() {
    const inspections = mockDatabase.inspections;
    if (inspections.length === 0) return;
    
    const excellent = inspections.filter(i => i.rating >= 90).length;
    const compliance = Math.round((excellent / inspections.length) * 100);
    const pending = inspections.filter(i => i.rating < 70).length;
    const critical = inspections.filter(i => i.rating < 50).length;
    
    document.getElementById('total-inspections').textContent = inspections.length;
    document.getElementById('compliance-rate').textContent = compliance + '%';
    document.getElementById('pending-corrections').textContent = pending;
    document.getElementById('critical-issues').textContent = critical;
}

function initializeReportCharts() {
    const statusCtx = document.getElementById('statusChart');
    if (!statusCtx) return;
    
    if (reportStatusChart) reportStatusChart.destroy();
    reportStatusChart = new Chart(statusCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed'],
            datasets: [{
                data: [
                    mockDatabase.inspections.filter(i => i.status === 'passed').length,
                    mockDatabase.inspections.filter(i => i.status !== 'passed').length
                ],
                backgroundColor: ['#28a745', '#dc3545'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    const typeCtx = document.getElementById('typeChart');
    if (!typeCtx) return;
    
    if (reportTypeChart) reportTypeChart.destroy();
    reportTypeChart = new Chart(typeCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Water Stations', 'Food Establishments'],
            datasets: [{
                label: 'Inspections',
                data: [
                    mockDatabase.inspections.filter(i => i.type === 'water').length,
                    mockDatabase.inspections.filter(i => i.type === 'food').length
                ],
                backgroundColor: ['#17a2b8', '#1b7d3d'],
                borderColor: ['#0c5460', '#0d4a1f'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });

    const trendCtx = document.getElementById('trendChart');
    if (!trendCtx) return;
    
    if (reportTrendChart) reportTrendChart.destroy();
    reportTrendChart = new Chart(trendCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Weekly Inspections',
                data: [8, 6, 9, 9],
                borderColor: '#1b7d3d',
                backgroundColor: 'rgba(27, 125, 61, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

function loadRecords(filteredRecords = null) {
    const tbody = document.getElementById('records-body');
    if (!tbody) return;
    
    const records = (filteredRecords || [...mockDatabase.inspections]).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-dark-emphasis">No records found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.establishment}</td>
            <td>
                <span class="badge ${record.type === 'water' ? 'bg-info' : 'bg-success'}">
                    ${record.type === 'water' ? 'Water' : 'Food'}
                </span>
            </td>
            <td>${record.inspector}</td>
            <td>
                <span class="badge bg-${getRatingColor(record.rating)}">${record.rating}%</span>
            </td>
            <td>
                <span class="badge bg-${record.status === 'passed' ? 'success' : 'danger'}">
                    ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-success" onclick="viewRecord(${record.id})">View</button>
            </td>
        </tr>
    `).join('');
}

function applyFilters() {
    const dateRange = document.getElementById('date-range').value;
    const inspectionType = document.getElementById('inspection-type').value;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(dateRange));
    
    let filtered = mockDatabase.inspections.filter(i => {
        const inspDate = new Date(i.date);
        return inspDate >= startDate && inspDate <= endDate;
    });
    
    if (inspectionType) {
        filtered = filtered.filter(i => i.type === inspectionType);
    }
    
    loadRecords(filtered);
}

function exportReport() {
    exportToCSV('sanitation-report.csv', mockDatabase.inspections);
}

function viewRecord(id) {
    const record = mockDatabase.inspections.find(r => r.id === id);
    if (record) {
        showCustomAlert(`Record Details:
Establishment: ${record.establishment}
Date: ${new Date(record.date).toLocaleDateString()}
Rating: ${record.rating}%
Inspector: ${record.inspector}
Address: ${record.address}`, 'info');
    }
}

function setupAuthForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginAlert = document.getElementById('login-alert');
    const signupAlert = document.getElementById('signup-alert');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleLogin(e, loginAlert));
    }
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => handleSignUp(e, signupAlert, loginForm, signupForm));
    }
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('d-none');
            signupForm.classList.remove('d-none');
            loginAlert.classList.add('d-none');
        });
    }
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.add('d-none');
            loginForm.classList.remove('d-none');
            signupAlert.classList.add('d-none');
        });
    }
}

function handleLogin(event, loginAlert) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    
    const user = mockDatabase.users.find(u => u.username === username && u.password === pass);
    
    if (user) {
        loginAlert.classList.add('d-none');
        saveToLocalStorage('currentUser', user);
        window.location.href = 'index.html';
    } else {
        loginAlert.classList.remove('d-none');
    }
}

function handleSignUp(event, signupAlert, loginForm, signupForm) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const pass = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-inspector').value;

    if (mockDatabase.users.find(u => u.username === username)) {
        signupAlert.classList.remove('d-none');
        return;
    }
    
    signupAlert.classList.add('d-none');
    
    const newUser = {
        id: mockDatabase.users.length + 1,
        username: username,
        password: pass,
        name: name
    };
    
    mockDatabase.users.push(newUser);
    saveToLocalStorage('users', mockDatabase.users);
    
    showCustomAlert('Account created successfully! Please login.');
    
    signupForm.classList.add('d-none');
    loginForm.classList.remove('d-none');
    loginForm.reset();
    signupForm.reset();
}