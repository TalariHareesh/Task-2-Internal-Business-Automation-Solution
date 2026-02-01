// Backend API URL (Relative path since we serve from same origin)
const API_URL = '/api/applicants';

// State
let applicants = [];
let isEditing = false;
let editingId = null;

// DOM Elements
const tableBody = document.getElementById('applicant-table-body');
const modal = document.getElementById('applicant-modal');
const form = document.getElementById('applicant-form');
const modalTitle = document.getElementById('modal-title');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    fetchApplicants();
});

// CRUD Operations via API

async function fetchApplicants() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch');
        applicants = await response.json();
        renderTable();
        updateStats();
    } catch (error) {
        console.error("Error connecting to backend:", error);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #EF4444;">Error connecting to Java Backend. Is it running?</td></tr>';
    }
}

function renderTable(data = applicants) {
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #999;">No applicants found</td></tr>';
        return;
    }

    data.forEach(app => {
        // Map legacy data to new terms
        const displayStatus = formatStatus(app.status);
        const statusClass = displayStatus.replace(/\s+/g, '-');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight: 500;">${app.name}</div>
                <div style="font-size: 12px; color: #6B7280;">${app.email}</div>
            </td>
            <td>${app.program}</td>
            <td>${app.date}</td>
            <td><span class="status-badge status-${statusClass}">${displayStatus}</span></td>
            <td>
                <button class="btn-icon-only" onclick="editApplicant(${app.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon-only" onclick="deleteApplicant(${app.id})" title="Delete"><i class="fa-solid fa-trash" style="color: #EF4444;"></i></button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function formatStatus(status) {
    const map = {
        'Pending': 'Action Required',
        'Shortlisted': 'Enrolled',
        'Rejected': 'Disqualified',
        'Discovery': 'Discovery Call Scheduled',
        'Interview': 'Discovery Call Scheduled'
    };
    return map[status] || status;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const program = document.getElementById('program').value;
    const email = document.getElementById('email').value;
    const status = document.getElementById('status').value;

    const applicantData = { name, program, email, status };

    try {
        if (isEditing) {
            // UPDATE
            await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(applicantData)
            });
        } else {
            // CREATE
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(applicantData)
            });
        }

        closeModal();
        fetchApplicants(); // Refresh data from server
    } catch (error) {
        alert("Operation failed: " + error.message);
    }
}

async function deleteApplicant(id) {
    if (confirm('Are you sure you want to remove this applicant?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchApplicants();
        } catch (error) {
            alert("Delete failed: " + error.message);
        }
    }
}

function editApplicant(id) {
    const app = applicants.find(a => a.id === id);
    if (!app) return;

    document.getElementById('name').value = app.name;
    document.getElementById('program').value = app.program;
    document.getElementById('email').value = app.email;
    document.getElementById('status').value = app.status;

    isEditing = true;
    editingId = id;
    modalTitle.textContent = "Edit Applicant Details";
    openModal();
}

// Helpers (Same as before)
function updateStats() {
    document.getElementById('total-count').textContent = applicants.length;
    document.getElementById('pending-count').textContent = applicants.filter(a => a.status === 'Action Required').length;
    document.getElementById('shortlisted-count').textContent = applicants.filter(a => a.status === 'Enrolled').length;
    document.getElementById('rejected-count').textContent = applicants.filter(a => a.status === 'Disqualified').length;
}

function filterApplicants() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = applicants.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.status.toLowerCase().includes(query)
    );
    renderTable(filtered);
}

function openModal() {
    modal.classList.remove('hidden');
    if (!isEditing) {
        form.reset();
        modalTitle.textContent = "New Applicant";
        document.getElementById('status').value = 'Action Required';
    }
}

function closeModal() {
    modal.classList.add('hidden');
    isEditing = false;
    editingId = null;
    form.reset();
}

function resetData() {
    alert("On the java backend, basic reset is done by restarting the server!");
}
