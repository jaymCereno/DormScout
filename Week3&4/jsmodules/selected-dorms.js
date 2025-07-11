// Selected dorms
// Main

// Load dorms
function loadSelectedDorms() {
    const container = document.getElementById('selectedDormsContainer');
    if (!container) {
        return;
    }
    // Use centralized database if available
    let selectedDorm = null;
    let selectedDormDate = null;
    if (window.dormScoutDB) {
        selectedDorm = dormScoutDB.getSelectedDorm();
        selectedDormDate = dormScoutDB.getSelectedDormDate();
    } else {
        // Fallback to localStorage
        selectedDorm = localStorage.getItem('selectedDorm');
        selectedDormDate = localStorage.getItem('selectedDormDate');
    }
    if (selectedDorm && selectedDormDate) {
        displaySelectedDorm(selectedDorm, selectedDormDate, container);
    } else {
        displayNoSelections(container);
    }
}

// Show dorm
function displaySelectedDorm(dormName, dateSelected, container) {
    const dormDetails = getDormDetails(dormName);
    
    // Image path
    let imagePath = dormDetails.image;
    if (window.dormScoutDB && window.dormScoutDB.getDormImageForProfile) {
        imagePath = window.dormScoutDB.getDormImageForProfile(dormName);
    } else if (!imagePath.startsWith('../') && !imagePath.startsWith('http')) {
        // Fallback ../
        imagePath = '../' + imagePath;
    }
    

    
    container.innerHTML = `
        <div class="selected-dorm-card" style="
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
        ">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="
                    width: 100px;
                    height: 100px;
                    background-image: url('${imagePath}');
                    background-size: cover;
                    background-position: center;
                    border-radius: 12px;
                    margin-right: 20px;
                "></div>
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 22px; font-weight: 600;">${dormName}</h3>
                    <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px;">${dormDetails.location}</p>
                    <p style="margin: 0; color: #174ca1; font-weight: 600; font-size: 18px;">${dormDetails.price}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0; color: #495057; font-size: 14px;">
                    <strong>Selected on:</strong> ${new Date(dateSelected).toLocaleDateString()}
                </p>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="applyToSelectedDorm('${dormName}')" style="
                    flex: 1;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " 
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(40, 167, 69, 0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >Apply Now</button>
                
                <button onclick="removeSelectedDorm()" style="
                    flex: 1;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " 
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(108, 117, 125, 0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >Remove</button>
            </div>
        </div>
    `;
}

// No selection
function displayNoSelections(container) {
    container.innerHTML = `
        <div class="no-selections" style="
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
        ">
            <div style="font-size: 48px; color: #dee2e6; margin-bottom: 20px;">🏠</div>
            <h3 style="color: #495057; margin-bottom: 10px; font-weight: 600;">No Dorm Selected</h3>
            <p style="margin-bottom: 30px; color: #6c757d; font-size: 16px; line-height: 1.5;">
                You haven't selected any dorm yet. Browse available dorms and make your selection!
            </p>
            <button onclick="showDormSelectionModal()" style="
                padding: 12px 24px;
                background: linear-gradient(135deg, #174ca1 0%, #1e5bb8 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
            " 
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(23, 76, 161, 0.3)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
            >Select a Dorm</button>
        </div>
    `;
}

// Dorm details
function getDormDetails(dormName) {
    // DB if available
    if (window.dormScoutDB) {
        return dormScoutDB.getDormDetails(dormName);
    }
    
    // Fallback static data
    const dormData = {
        "One Morayta": {
            price: "₱9,000 - ₱15,000/month",
            location: "1234 Morayta St, Sampaloc, Manila - Near UST",
            image: "../images/home page one morayta.png"
        },
        "University Tower": {
            price: "₱15,000 - ₱22,000/month", 
            location: "University Belt, Manila",
            image: "../images/home page university tower.png"
        },
        "Vista Recto": {
            price: "₱12,000 - ₱18,000/month",
            location: "Recto Avenue, Manila", 
            image: "../images/home page vista recto.png"
        },
        "Luxury University Heights": {
            price: "₱22,000/month",
            location: "789 University Avenue, Manila",
            image: "../images/home page one morayta.png"
        },
        "Premium Sampaloc Residence": {
            price: "₱15,000/month",
            location: "123 Sampaloc Street, Manila",
            image: "../images/home page university tower.png"
        },
        "Budget Quiapo Dormitory": {
            price: "₱5,000/month",
            location: "456 Quiapo Boulevard, Manila",
            image: "../images/home page vista recto.png"
        }
    };
    
    return dormData[dormName] || {
        price: "Contact for pricing",
        location: "Manila", 
        image: "../images/DormScout Logo.png"
    };
}

// Apply dorm
function applyToSelectedDorm(dormName) {
    if (window.dormScoutDB) {
        // Already applied?
        if (window.dormScoutDB.hasAppliedToDorm(dormName)) {
            if (window.showNotification) {
                window.showNotification('You have already applied to this dorm!', 'error');
            }
            return;
        }
        // New app
        const application = {
            id: 'APP' + Date.now(),
            name: dormName,
            applicationDate: new Date().toISOString(),
            status: 'pending',
            message: `Application for ${dormName} submitted successfully.`
        };
        const result = window.dormScoutDB.addApplication(application);
        if (result.success) {
            if (window.showNotification) {
                window.showNotification(`Application submitted for ${dormName}!`, 'success');
            }
            // Refresh
            loadSelectedDorms();
            if (window.loadApplications) {
                window.loadApplications();
            }
        } else {
            if (window.showNotification) {
                window.showNotification(result.message || 'Failed to submit application!', 'error');
            }
        }
    } else {
        if (window.showNotification) {
            window.showNotification('Database not available!', 'error');
        }
    }
}

// Remove dorm
function removeSelectedDorm() {
    if (window.createConfirmationModal) {
        window.createConfirmationModal({
            title: 'Remove Selected Dorm',
            message: 'Are you sure you want to remove this dorm from your selections? This action cannot be undone.',
            confirmText: 'Remove',
            cancelText: 'Cancel',
            onConfirm: 'confirmRemoveSelectedDorm()'
        });
    }
}

// Confirm remove
function confirmRemoveSelectedDorm() {
    // Remove dorm DB
    if (window.dormScoutDB) {
        const result = window.dormScoutDB.removeSelectedDorm();
        if (result) {
            if (window.showNotification) {
                window.showNotification('Dorm removed from your selections!', 'success');
            }
            loadSelectedDorms();
        } else {
            if (window.showNotification) {
                window.showNotification('Failed to remove dorm. Please try again.', 'error');
            }
        }
    } else {
        // Fallback localStorage
        localStorage.removeItem('selectedDorm');
        localStorage.removeItem('selectedDormDate');
        if (window.showNotification) {
            window.showNotification('Dorm removed from your selections!', 'success');
        }
        loadSelectedDorms();
    }
}

// Show modal
function showDormSelectionModal() {
    const modalHtml = `
        <div id="dormSelectionModal" class="dorm-selection-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        ">
            <div class="modal-content" style="
                background: white;
                border-radius: 16px;
                max-width: 800px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                position: relative;
            ">
                <div class="modal-header" style="
                    padding: 30px 30px 20px;
                    border-bottom: 1px solid #e9ecef;
                    position: sticky;
                    top: 0;
                    background: white;
                    border-radius: 16px 16px 0 0;
                    z-index: 1001;
                ">
                    <h2 style="
                        margin: 0;
                        color: #2c3e50;
                        font-size: 24px;
                        font-weight: 600;
                    ">Select a Dorm</h2>
                    <button onclick="closeDormSelectionModal()" style="
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: none;
                        border: none;
                        font-size: 28px;
                        color: #6c757d;
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                    " 
                    onmouseover="this.style.background='#f8f9fa'; this.style.color='#495057'"
                    onmouseout="this.style.background='none'; this.style.color='#6c757d'"
                    >&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px 30px 30px;" id="dormSelectionList">
                    ${getDormSelectionList()}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Get list of available dorms for selection
function getDormSelectionList() {
    // All dorms
    let availableDorms = [];
    if (window.dormScoutDB && typeof window.dormScoutDB.getAllDorms === 'function') {
        availableDorms = window.dormScoutDB.getAllDorms();
    } else {
        // Fallback list
        availableDorms = [
            'One Morayta',
            'University Tower', 
            'Vista Recto',
            'Luxury University Heights',
            'Premium Sampaloc Residence',
            'Budget Quiapo Dormitory'
        ];
    }
    
    return availableDorms.map(dormName => {
        const details = getDormDetails(dormName);
        
        // Image path
        let imagePath = details.image;
        if (window.dormScoutDB && window.dormScoutDB.getDormImageForProfile) {
            imagePath = window.dormScoutDB.getDormImageForProfile(dormName);
        } else if (!imagePath.startsWith('../') && !imagePath.startsWith('http')) {
            // Fallback ../
            imagePath = '../' + imagePath;
        }
        
        return `
            <div class="dorm-selection-item" style="
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 12px;
                margin-bottom: 15px;
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
            " 
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'; this.style.borderColor='#174ca1'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='#e9ecef'"
            onclick="selectDormFromModal('${dormName}')"
            >
                <div style="display: flex; align-items: center; padding: 20px;">
                    <div style="
                        width: 80px;
                        height: 80px;
                        background-image: url('${imagePath}');
                        background-size: cover;
                        background-position: center;
                        border-radius: 8px;
                        margin-right: 20px;
                        flex-shrink: 0;
                    "></div>
                    <div style="flex: 1;">
                        <h4 style="
                            margin: 0 0 8px 0;
                            color: #2c3e50;
                            font-size: 18px;
                            font-weight: 600;
                        ">${dormName}</h4>
                        <p style="
                            margin: 0 0 4px 0;
                            color: #6c757d;
                            font-size: 14px;
                        ">${details.location}</p>
                        <p style="
                            margin: 0;
                            color: #174ca1;
                            font-weight: 600;
                            font-size: 16px;
                        ">${details.price}</p>
                    </div>
                    <div style="
                        background: linear-gradient(135deg, #174ca1 0%, #1e5bb8 100%);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 600;
                        margin-left: 15px;
                    ">Select</div>
                </div>
            </div>
        `;
    }).join('');
}

// Close modal
function closeDormSelectionModal() {
    const modal = document.getElementById('dormSelectionModal');
    if (modal) {
        modal.remove();
    }
}

// Select dorm
function selectDormFromModal(dormName) {
    // Store dorm
    if (window.dormScoutDB) {
        window.dormScoutDB.setSelectedDorm(dormName);
    } else {
        // Fallback localStorage
        localStorage.setItem('selectedDorm', dormName);
        localStorage.setItem('selectedDormDate', new Date().toISOString());
    }
    
    // Close modal
    closeDormSelectionModal();
    
    // Notify
    if (window.showNotification) {
        window.showNotification(`${dormName} has been added to your selected dorms!`, 'success');
    }
    
    // Refresh
    loadSelectedDorms();
}



// Export functions to global scope
window.loadSelectedDorms = loadSelectedDorms;
window.applyToSelectedDorm = applyToSelectedDorm;
window.removeSelectedDorm = removeSelectedDorm;
window.confirmRemoveSelectedDorm = confirmRemoveSelectedDorm;
window.showDormSelectionModal = showDormSelectionModal;
window.closeDormSelectionModal = closeDormSelectionModal;
window.selectDormFromModal = selectDormFromModal;
window.addTestSelectedDorm = addTestSelectedDorm;
window.getDormDetails = getDormDetails;
