// Percentage Calculator Functions

// Tab Switching
document.addEventListener('DOMContentLoaded', function() {
    initCalculatorTabs();
    initInputValidation();
});

function initCalculatorTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
            
            // Update URL hash
            window.location.hash = tabId;
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('tabchange', { 
                detail: { tab: tabId } 
            }));
        });
    });
    
    // Check URL hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
        if (tabBtn) tabBtn.click();
    }
}

// Input Validation
function initInputValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        // Create error message element
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        input.parentNode.appendChild(errorMsg);
        
        // Validate on input
        input.addEventListener('input', function() {
            validateInput(this);
        });
        
        // Validate on blur
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
}

function validateInput(input) {
    const value = parseFloat(input.value);
    const errorMsg = input.parentNode.querySelector('.error-message');
    
    // Clear previous error
    errorMsg.textContent = '';
    input.style.borderColor = '';
    
    // Check if empty
    if (input.value === '') {
        errorMsg.textContent = 'This field is required';
        input.style.borderColor = 'var(--error-color)';
        return false;
    }
    
    // Check if valid number
    if (isNaN(value)) {
        errorMsg.textContent = 'Please enter a valid number';
        input.style.borderColor = 'var(--error-color)';
        return false;
    }
    
    // Check min value
    if (input.hasAttribute('min')) {
        const min = parseFloat(input.getAttribute('min'));
        if (value < min) {
            errorMsg.textContent = `Value must be at least ${min}`;
            input.style.borderColor = 'var(--error-color)';
            return false;
        }
    }
    
    // Check max value
    if (input.hasAttribute('max')) {
        const max = parseFloat(input.getAttribute('max'));
        if (value > max) {
            errorMsg.textContent = `Value must be at most ${max}`;
            input.style.borderColor = 'var(--error-color)';
            return false;
        }
    }
    
    // Check percentage range (0-1000)
    if (input.id === 'percentageValue' && (value < 0 || value > 1000)) {
        errorMsg.textContent = 'Percentage must be between 0 and 1000';
        input.style.borderColor = 'var(--error-color)';
        return false;
    }
    
    // Valid input
    input.style.borderColor = 'var(--success-color)';
    return true;
}

// Calculation Functions

// 1. Percentage of a Number
function calculatePercentageOf() {
    const percentage = document.getElementById('percentageValue').value;
    const base = document.getElementById('baseValue').value;
    
    // Validate inputs
    if (!validateInput(document.getElementById('percentageValue')) || 
        !validateInput(document.getElementById('baseValue'))) {
        return;
    }
    
    const result = (parseFloat(percentage) / 100) * parseFloat(base);
    const resultElement = document.getElementById('percentageOfResult');
    
    resultElement.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                ${formatNumber(result)}
            </div>
            <div style="font-size: 1rem; color: var(--text-light);">
                ${percentage}% of ${formatNumber(base)} = ${formatNumber(result)}
            </div>
        </div>
    `;
    
    // Highlight result
    highlightResult(resultElement);
    
    // Update step-by-step explanation
    updateStepByStepExplanation('percentage-of', {
        percentage: percentage,
        base: base,
        result: result
    });
}

function resetPercentageOf() {
    document.getElementById('percentageValue').value = '';
    document.getElementById('baseValue').value = '';
    document.getElementById('percentageOfResult').textContent = 'Enter values to calculate';
    
    // Reset input borders
    const inputs = ['percentageValue', 'baseValue'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.style.borderColor = '';
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = '';
    });
}

// 2. Percentage Increase
function calculatePercentageIncrease() {
    const original = document.getElementById('originalValue').value;
    const increase = document.getElementById('increaseValue').value;
    
    if (!validateInput(document.getElementById('originalValue')) || 
        !validateInput(document.getElementById('increaseValue'))) {
        return;
    }
    
    const originalNum = parseFloat(original);
    const increaseNum = parseFloat(increase);
    const newValue = originalNum + increaseNum;
    const percentageIncrease = (increaseNum / originalNum) * 100;
    const resultElement = document.getElementById('percentageIncreaseResult');
    
    resultElement.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                ${formatNumber(percentageIncrease)}%
            </div>
            <div style="font-size: 1rem; color: var(--text-light);">
                From ${formatNumber(original)} to ${formatNumber(newValue)} = ${formatNumber(percentageIncrease)}% increase
            </div>
        </div>
    `;
    
    highlightResult(resultElement);
    
    updateStepByStepExplanation('percentage-increase', {
        original: original,
        increase: increase,
        newValue: newValue,
        percentage: percentageIncrease
    });
}

function resetPercentageIncrease() {
    document.getElementById('originalValue').value = '';
    document.getElementById('increaseValue').value = '';
    document.getElementById('percentageIncreaseResult').textContent = 'Enter values to calculate';
}

// 3. Percentage Decrease
function calculatePercentageDecrease() {
    const original = document.getElementById('originalValueDec').value;
    const decrease = document.getElementById('decreaseValue').value;
    
    if (!validateInput(document.getElementById('originalValueDec')) || 
        !validateInput(document.getElementById('decreaseValue'))) {
        return;
    }
    
    const originalNum = parseFloat(original);
    const decreaseNum = parseFloat(decrease);
    const newValue = originalNum - decreaseNum;
    const percentageDecrease = (decreaseNum / originalNum) * 100;
    const resultElement = document.getElementById('percentageDecreaseResult');
    
    resultElement.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                ${formatNumber(percentageDecrease)}%
            </div>
            <div style="font-size: 1rem; color: var(--text-light);">
                From ${formatNumber(original)} to ${formatNumber(newValue)} = ${formatNumber(percentageDecrease)}% decrease
            </div>
        </div>
    `;
    
    highlightResult(resultElement);
    
    updateStepByStepExplanation('percentage-decrease', {
        original: original,
        decrease: decrease,
        newValue: newValue,
        percentage: percentageDecrease
    });
}

function resetPercentageDecrease() {
    document.getElementById('originalValueDec').value = '';
    document.getElementById('decreaseValue').value = '';
    document.getElementById('percentageDecreaseResult').textContent = 'Enter values to calculate';
}

// 4. Find Percentage
function calculateFindPercentage() {
    const part = document.getElementById('partValue').value;
    const whole = document.getElementById('wholeValue').value;
    
    if (!validateInput(document.getElementById('partValue')) || 
        !validateInput(document.getElementById('wholeValue'))) {
        return;
    }
    
    const partNum = parseFloat(part);
    const wholeNum = parseFloat(whole);
    
    if (wholeNum === 0) {
        showNotification('Whole value cannot be zero', 'error');
        return;
    }
    
    const percentage = (partNum / wholeNum) * 100;
    const resultElement = document.getElementById('findPercentageResult');
    
    resultElement.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                ${formatNumber(percentage)}%
            </div>
            <div style="font-size: 1rem; color: var(--text-light);">
                ${formatNumber(part)} is ${formatNumber(percentage)}% of ${formatNumber(whole)}
            </div>
        </div>
    `;
    
    highlightResult(resultElement);
    
    updateStepByStepExplanation('find-percentage', {
        part: part,
        whole: whole,
        percentage: percentage
    });
}

function resetFindPercentage() {
    document.getElementById('partValue').value = '';
    document.getElementById('wholeValue').value = '';
    document.getElementById('findPercentageResult').textContent = 'Enter values to calculate';
}

// Helper Functions
function highlightResult(element) {
    element.classList.remove('highlight');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('highlight');
    
    // Remove highlight class after animation
    setTimeout(() => {
        element.classList.remove('highlight');
    }, 500);
}

function formatNumber(num, decimals = 2) {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function updateStepByStepExplanation(calculationType, data) {
    const explanationDiv = document.getElementById('stepByStepExplanation');
    let explanationHTML = '';
    
    switch(calculationType) {
        case 'percentage-of':
            explanationHTML = `
                <h3>Step-by-Step Calculation: Percentage of a Number</h3>
                <p><strong>Formula:</strong> Result = (Percentage ÷ 100) × Base Number</p>
                <div class="step-counter">
                    <div class="step completed">1</div>
                    <div class="step-label">Divide percentage by 100</div>
                </div>
                <p>${formatNumber(data.percentage)} ÷ 100 = ${formatNumber(data.percentage / 100)}</p>
                
                <div class="step-counter">
                    <div class="step completed">2</div>
                    <div class="step-label">Multiply by base number</div>
                </div>
                <p>${formatNumber(data.percentage / 100)} × ${formatNumber(data.base)} = ${formatNumber(data.result)}</p>
                
                <div class="formula-display">
                    <strong>Final Result:</strong><br>
                    ${formatNumber(data.percentage)}% of ${formatNumber(data.base)} = ${formatNumber(data.result)}
                </div>
                
                <div class="example-box">
                    <h4>Example:</h4>
                    <p>If you want to calculate 15% of 200:</p>
                    <p>1. 15 ÷ 100 = 0.15</p>
                    <p>2. 0.15 × 200 = 30</p>
                    <p>So, 15% of 200 is 30.</p>
                </div>
            `;
            break;
            
        case 'percentage-increase':
            explanationHTML = `
                <h3>Step-by-Step Calculation: Percentage Increase</h3>
                <p><strong>Formula:</strong> Percentage Increase = [(New Value - Original Value) ÷ Original Value] × 100</p>
                
                <div class="step-counter">
                    <div class="step completed">1</div>
                    <div class="step-label">Find the increase amount</div>
                </div>
                <p>New Value (${formatNumber(data.original)} + ${formatNumber(data.increase)}) - Original Value (${formatNumber(data.original)}) = ${formatNumber(data.increase)}</p>
                
                <div class="step-counter">
                    <div class="step completed">2</div>
                    <div class="step-label">Divide increase by original value</div>
                </div>
                <p>${formatNumber(data.increase)} ÷ ${formatNumber(data.original)} = ${formatNumber(data.increase / data.original)}</p>
                
                <div class="step-counter">
                    <div class="step completed">3</div>
                    <div class="step-label">Multiply by 100 to get percentage</div>
                </div>
                <p>${formatNumber(data.increase / data.original)} × 100 = ${formatNumber(data.percentage)}%</p>
                
                <div class="formula-display">
                    <strong>Final Result:</strong><br>
                    From ${formatNumber(data.original)} to ${formatNumber(data.newValue)} = ${formatNumber(data.percentage)}% increase
                </div>
            `;
            break;
            
        case 'percentage-decrease':
            explanationHTML = `
                <h3>Step-by-Step Calculation: Percentage Decrease</h3>
                <p><strong>Formula:</strong> Percentage Decrease = [(Original Value - New Value) ÷ Original Value] × 100</p>
                
                <div class="step-counter">
                    <div class="step completed">1</div>
                    <div class="step-label">Find the decrease amount</div>
                </div>
                <p>Original Value (${formatNumber(data.original)}) - New Value (${formatNumber(data.newValue)}) = ${formatNumber(data.decrease)}</p>
                
                <div class="step-counter">
                    <div class="step completed">2</div>
                    <div class="step-label">Divide decrease by original value</div>
                </div>
                <p>${formatNumber(data.decrease)} ÷ ${formatNumber(data.original)} = ${formatNumber(data.decrease / data.original)}</p>
                
                <div class="step-counter">
                    <div class="step completed">3</div>
                    <div class="step-label">Multiply by 100 to get percentage</div>
                </div>
                <p>${formatNumber(data.decrease / data.original)} × 100 = ${formatNumber(data.percentage)}%</p>
                
                <div class="formula-display">
                    <strong>Final Result:</strong><br>
                    From ${formatNumber(data.original)} to ${formatNumber(data.newValue)} = ${formatNumber(data.percentage)}% decrease
                </div>
            `;
            break;
            
        case 'find-percentage':
            explanationHTML = `
                <h3>Step-by-Step Calculation: Find What Percentage One Number Is of Another</h3>
                <p><strong>Formula:</strong> Percentage = (Part ÷ Whole) × 100</p>
                
                <div class="step-counter">
                    <div class="step completed">1</div>
                    <div class="step-label">Divide part by whole</div>
                </div>
                <p>${formatNumber(data.part)} ÷ ${formatNumber(data.whole)} = ${formatNumber(data.part / data.whole)}</p>
                
                <div class="step-counter">
                    <div class="step completed">2</div>
                    <div class="step-label">Multiply by 100 to get percentage</div>
                </div>
                <p>${formatNumber(data.part / data.whole)} × 100 = ${formatNumber(data.percentage)}%</p>
                
                <div class="formula-display">
                    <strong>Final Result:</strong><br>
                    ${formatNumber(data.part)} is ${formatNumber(data.percentage)}% of ${formatNumber(data.whole)}
                </div>
                
                <div class="example-box">
                    <h4>Example:</h4>
                    <p>If you scored 45 marks out of 60:</p>
                    <p>1. 45 ÷ 60 = 0.75</p>
                    <p>2. 0.75 × 100 = 75%</p>
                    <p>So, you scored 75%.</p>
                </div>
            `;
            break;
    }
    
    explanationDiv.innerHTML = explanationHTML;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter to calculate
    if (e.ctrlKey && e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-pane.active');
        if (activeTab) {
            const calculateBtn = activeTab.querySelector('.calculate-btn');
            if (calculateBtn) calculateBtn.click();
        }
    }
    
    // Escape to reset
    if (e.key === 'Escape') {
        const activeTab = document.querySelector('.tab-pane.active');
        if (activeTab) {
            const resetBtn = activeTab.querySelector('.reset-btn');
            if (resetBtn) resetBtn.click();
        }
    }
});

// Copy result to clipboard
function copyResult(resultId) {
    const resultElement = document.getElementById(resultId);
    const textToCopy = resultElement.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Result copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy result', 'error');
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePercentageOf,
        calculatePercentageIncrease,
        calculatePercentageDecrease,
        calculateFindPercentage,
        formatNumber,
        updateStepByStepExplanation
    };
}
