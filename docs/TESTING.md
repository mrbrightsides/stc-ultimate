# STC Ultimate - Testing Guide

Panduan lengkap untuk testing STC Ultimate sebelum dan setelah deployment.

---

## 📋 Pre-Deployment Testing Checklist

### ✅ Phase 1: Destination & Package System

#### Destination Selection
- [ ] All 4 destinations (Bali, Yogyakarta, Jakarta, Lombok) dapat dipilih
- [ ] Pricing tiers benar:
  - [ ] Yogyakarta: 0.15 ETH (Budget)
  - [ ] Lombok: 0.17 ETH (Standard)
  - [ ] Jakarta: 0.18 ETH (Standard)
  - [ ] Bali: 0.20 ETH (Premium)
- [ ] Destination highlights display correctly (6 attractions per destination)

#### Duration & Pricing
- [ ] 3-day packages calculate correctly
- [ ] 5-day packages calculate correctly
- [ ] 7-day packages calculate correctly
- [ ] Price multipliers working:
  - [ ] Budget tier: 1.0x, 1.6x, 2.1x
  - [ ] Standard tier: 1.0x, 1.7x, 2.3x
  - [ ] Premium tier: 1.0x, 1.8x, 2.5x

#### Date Selection
- [ ] Calendar date picker opens
- [ ] Can select start date
- [ ] Can select end date
- [ ] Date range validates correctly
- [ ] Indonesian localization displayed

#### Package Display
- [ ] All-inclusive services shown:
  - [ ] Flights (round-trip)
  - [ ] Hotel accommodation
  - [ ] Ground transportation
  - [ ] Meals (breakfast, lunch, dinner)
  - [ ] Tourist activities
  - [ ] Souvenir vouchers
- [ ] Total price calculated correctly
- [ ] Service breakdown displayed
- [ ] No cherry-picking options (correct behavior)

---

### ✅ Phase 2: Escrow & Sequential IoT

#### Escrow Initialization
- [ ] "Lock Funds in Escrow" button visible
- [ ] Click triggers MetaMask popup
- [ ] Transaction parameters correct:
  - [ ] Recipient address valid
  - [ ] Amount matches package total
  - [ ] Gas estimate reasonable
- [ ] Can sign transaction
- [ ] Can reject transaction
- [ ] Success message appears after signing
- [ ] Etherscan link generated and clickable
- [ ] Booking ID generated and displayed

#### Sequential IoT Engine
- [ ] "Begin Journey" button appears after escrow locked
- [ ] Demo speed toggle visible
- [ ] Can switch between Instant (5s) and Real-time (30-40s)
- [ ] First milestone starts automatically
- [ ] 5-stage verification animates correctly:
  - [ ] Stage 1: Detecting (yellow spinner)
  - [ ] Stage 2: Verifying (blue spinner)
  - [ ] Stage 3: Broadcasting (purple spinner)
  - [ ] Stage 4: Confirming (orange spinner)
  - [ ] Stage 5: Releasing (green checkmark)
- [ ] Progress bar updates per stage
- [ ] Event log streams live updates
- [ ] IPFS proof hash displayed
- [ ] Transaction hash displayed
- [ ] Etherscan link works

#### Milestone Progression
- [ ] All 15 milestones execute in sequence
- [ ] Cannot skip milestones (correct behavior)
- [ ] Each milestone has correct:
  - [ ] Service type (Departure Flight, Hotel Check-in, etc.)
  - [ ] IoT trigger type (RFID, GPS, QR, Biometric)
  - [ ] Amount to release
  - [ ] Vendor address
- [ ] Vendor addresses different per service type
- [ ] Timeline updates visually with each completion

#### Multi-Vendor Distribution
- [ ] 6 different vendor types receive payments:
  - [ ] Airline (0x1a2B...)
  - [ ] Hotel (0x3c4D...)
  - [ ] Transport (0x5e6F...)
  - [ ] Restaurant (0x7g8H...)
  - [ ] Tourism (0x9i0J...)
  - [ ] Retail (0xKlMn...)
- [ ] Amounts distributed correctly per milestone
- [ ] Total released = total escrow amount

---

### ✅ Phase 3: Analytics & Performance

#### IPFS Proof Generation
- [ ] IPFS hash generated per milestone
- [ ] Hash format: `bafybei...` (CIDv1)
- [ ] Gateway URL clickable: `https://ipfs.io/ipfs/{hash}`
- [ ] Proof includes:
  - [ ] Timestamp
  - [ ] Device type
  - [ ] Location data
  - [ ] Verification signature

#### Performance Metrics
- [ ] Analytics dashboard displays after escrow initialization
- [ ] 4 overview cards show:
  - [ ] Total Transactions count
  - [ ] Total Gas Cost (ETH)
  - [ ] Average Transaction Time (seconds)
  - [ ] Efficiency Score (0-100)
- [ ] Metrics update after each milestone
- [ ] Gas cost analysis section shows:
  - [ ] Per-milestone gas cost
  - [ ] Total gas used
  - [ ] Gas price (30 Gwei)
- [ ] Transaction speed section shows:
  - [ ] Fastest transaction
  - [ ] Average time
  - [ ] Slowest transaction
- [ ] Vendor distribution section shows:
  - [ ] Per-vendor payment amounts
  - [ ] Percentage breakdown
  - [ ] Total paid per vendor

#### Cost Comparison
- [ ] Traditional payment processor cost calculated (3%)
- [ ] Blockchain cost displayed (actual gas)
- [ ] Savings percentage shown (typically ~89%)
- [ ] Comparison chart visible

#### Audit Trail Export
- [ ] "Export Audit Trail" button appears after journey complete
- [ ] CSV export works
  - [ ] File downloads with correct filename
  - [ ] Contains all transactions
  - [ ] Properly formatted columns
- [ ] JSON export works
  - [ ] File downloads with correct filename
  - [ ] Valid JSON structure
  - [ ] Includes all data (transactions, proofs, metrics)
- [ ] Export statistics displayed:
  - [ ] Transaction count
  - [ ] IPFS proof count
  - [ ] Journey duration
  - [ ] Total ETH distributed

---

### ✅ Phase 4: Enhanced UX & Integration

#### QR Scanner
- [ ] QR scanner button appears in demo mode
- [ ] Click opens camera view
- [ ] Camera permissions requested
- [ ] Can scan QR code
- [ ] Valid QR triggers milestone
- [ ] Invalid QR shows error
- [ ] Can close scanner
- [ ] Falls back to simulation if camera unavailable

#### Demo Speed Toggle
- [ ] Toggle switch visible before journey starts
- [ ] Can switch between modes:
  - [ ] Instant Mode (5s per milestone)
  - [ ] Real-time Mode (30-40s per milestone)
- [ ] Selected mode persists during journey
- [ ] Time estimates update based on mode

#### User Guide
- [ ] Guide overlay appears on first visit
- [ ] 5 steps display correctly:
  - [ ] Step 1: Welcome
  - [ ] Step 2: Escrow Explained
  - [ ] Step 3: IoT Triggers
  - [ ] Step 4: Security & Transparency
  - [ ] Step 5: Getting Started
- [ ] Can navigate between steps
- [ ] Can close guide
- [ ] "Don't show again" checkbox works
- [ ] Guide doesn't appear on subsequent visits (localStorage)
- [ ] Can manually reopen guide from menu

#### Dispute Resolution
- [ ] Milestone timeout handled gracefully
- [ ] Error messages display clearly
- [ ] Refund calculation correct for failed milestones
- [ ] Partial refund processed automatically
- [ ] User notified of refund amount

#### STC Ecosystem Page
- [ ] "STC Ecosystem" menu item navigates correctly
- [ ] All 12 ecosystem apps displayed:
  - [ ] STC Analytics
  - [ ] STC GasVision
  - [ ] STC Converter
  - [ ] STC Bench
  - [ ] STC Insight
  - [ ] STC GasX
  - [ ] STC CarbonPrint
  - [ ] STC ImpactViz
  - [ ] STC Connect
  - [ ] KYC by STC
  - [ ] AudiTour
  - [ ] STC Ultimate (with "You're Here!" badge)
- [ ] Category badges color-coded correctly
- [ ] Launch buttons open apps in new tabs
- [ ] Descriptions and visions display correctly
- [ ] Stats footer shows correct numbers (12 Apps, 6 Categories)

---

## 🧪 Post-Deployment Testing (Production)

### Prerequisites
- [ ] MetaMask installed and configured
- [ ] Sepolia testnet selected
- [ ] Testnet ETH available (get from [faucet](https://sepoliafaucet.com/))
- [ ] Production URL accessible

### Real Transaction Testing

#### 1. Connect Wallet
```
Steps:
1. Open production URL
2. Click "Connect Wallet" (if prompted)
3. MetaMask popup appears
4. Select account
5. Click "Connect"

Expected:
✅ Wallet address displayed in UI
✅ Sepolia network detected
✅ ETH balance shown
```

#### 2. Book Package
```
Steps:
1. Select destination: Bali
2. Select duration: 5 days
3. Pick dates: Today + 5 days
4. Review package (0.36 ETH example)
5. Click "Lock Funds in Escrow"

Expected:
✅ MetaMask popup with transaction details
✅ Gas estimate displayed
✅ Can sign transaction
```

#### 3. Sign Transaction
```
Steps:
1. Review transaction in MetaMask
2. Verify recipient address
3. Verify amount (0.36 ETH)
4. Click "Confirm"

Expected:
✅ Transaction submitted
✅ Pending status shown
✅ Transaction hash generated
```

#### 4. Verify on Etherscan
```
Steps:
1. Click Etherscan link in UI
2. New tab opens to sepolia.etherscan.io

Expected:
✅ Transaction found
✅ Status: Success
✅ From: Your wallet address
✅ To: Vendor address
✅ Value: Correct ETH amount
✅ Gas used: ~21,000
```

#### 5. Execute Journey
```
Steps:
1. Toggle demo speed (optional)
2. Click "Begin Journey"
3. Watch sequential milestones
4. Monitor event log
5. Check analytics

Expected:
✅ All 15 milestones complete
✅ Each has unique transaction hash
✅ All Etherscan links valid
✅ Total time reasonable (5-10 minutes)
✅ No errors in console
```

#### 6. Verify Multi-Vendor Distribution
```
Steps:
1. Check analytics vendor breakdown
2. Click each Etherscan link
3. Verify different recipient addresses

Expected:
✅ 6 different vendor addresses
✅ Amounts sum to total escrow
✅ All transactions confirmed
```

#### 7. Export Audit Trail
```
Steps:
1. Scroll to audit export section
2. Click "Export as CSV"
3. Click "Export as JSON"

Expected:
✅ CSV file downloads
✅ JSON file downloads
✅ Both contain complete data
✅ Transaction hashes match Etherscan
```

---

## 📊 Performance Benchmarks

### Expected Metrics (Sepolia Testnet)

```
Metric                          Target      Acceptable Range
────────────────────────────────────────────────────────────
Escrow Initialization           15-20s      10-30s
Milestone Execution (Instant)   5s          3-7s
Milestone Execution (Real-time) 35s         30-45s
Total Journey (15 milestones)   8-10 min    5-15 min
Gas per Transaction             21,000      20,000-25,000
Gas Cost per Milestone          0.0003 ETH  0.0002-0.0005 ETH
Total Gas Cost (15 milestones)  0.0045 ETH  0.003-0.006 ETH
Efficiency Score                90-98       85-100
```

### Performance Red Flags 🚨

- Transaction taking >60 seconds → Network congestion or error
- Gas cost >0.001 ETH per transaction → Gas price spike
- Milestone fails to complete → Contract error or network issue
- Efficiency score <80 → Performance degradation
- Missing transaction hashes → Blockchain communication error

---

## 🐛 Common Issues & Solutions

### Issue 1: MetaMask Not Popping Up
**Symptoms**: Click "Lock Funds" but MetaMask doesn't open

**Possible Causes**:
- MetaMask not installed
- Wrong network selected
- Browser blocking popup

**Solutions**:
1. Install MetaMask extension
2. Switch to Sepolia testnet in MetaMask
3. Check browser popup blocker settings
4. Hard refresh page (Ctrl+Shift+R)

---

### Issue 2: Transaction Fails
**Symptoms**: MetaMask shows "Transaction Failed"

**Possible Causes**:
- Insufficient gas
- Insufficient ETH balance
- Network congestion
- Invalid recipient address

**Solutions**:
1. Check Sepolia ETH balance (need >0.01 ETH)
2. Get more testnet ETH from faucet
3. Increase gas limit in MetaMask
4. Try again later if network congested
5. Verify recipient address format

---

### Issue 3: Milestones Not Progressing
**Symptoms**: Journey starts but stuck on one milestone

**Possible Causes**:
- JavaScript error
- Network connection lost
- Demo speed timer issue

**Solutions**:
1. Open browser console (F12) and check for errors
2. Check internet connection
3. Hard refresh page
4. Try different demo speed mode
5. Report error to support with console log

---

### Issue 4: Etherscan Link 404
**Symptoms**: Click transaction link but Etherscan shows "not found"

**Possible Causes**:
- Transaction still pending
- Wrong network (not Sepolia)
- Transaction hash incorrect

**Solutions**:
1. Wait 30 seconds and refresh Etherscan
2. Verify MetaMask on Sepolia network
3. Copy transaction hash and search manually on Etherscan
4. Check if transaction actually broadcast (MetaMask Activity tab)

---

### Issue 5: Export Fails
**Symptoms**: Click export but no file downloads

**Possible Causes**:
- Browser blocking download
- Journey not complete
- Data not generated

**Solutions**:
1. Check browser download permissions
2. Ensure journey 100% complete
3. Try different export format (CSV vs JSON)
4. Hard refresh and try again

---

## 📸 Screenshot Collection for Paper

### Required Screenshots

#### 1. Landing Page
- [ ] Full hero section dengan CTA buttons
- [ ] Navigation menu visible
- [ ] Footer with ecosystem apps

#### 2. Destination Selection
- [ ] All 4 destinations displayed
- [ ] Pricing tiers visible
- [ ] Tier badges (Budget, Standard, Premium)

#### 3. Package Builder
- [ ] All-inclusive services list
- [ ] Price breakdown
- [ ] Duration multiplier effect
- [ ] Date picker

#### 4. Escrow Initialization
- [ ] Modal with escrow explanation
- [ ] Total amount display
- [ ] "Lock Funds" button
- [ ] Terms and conditions

#### 5. MetaMask Signature
- [ ] MetaMask popup
- [ ] Transaction details
- [ ] Gas estimate
- [ ] Confirm/Reject buttons

#### 6. Sequential IoT Engine
- [ ] Current milestone card
- [ ] 5-stage progress bar
- [ ] Live event log
- [ ] Upcoming milestones preview

#### 7. Milestone Timeline
- [ ] All 15 milestones listed
- [ ] Completed (green), In Progress (cyan), Locked (gray)
- [ ] Vendor addresses
- [ ] IoT trigger types

#### 8. Analytics Dashboard
- [ ] 4 overview cards
- [ ] Gas cost analysis
- [ ] Transaction speed chart
- [ ] Vendor distribution

#### 9. Cost Comparison
- [ ] Traditional vs Blockchain
- [ ] Savings percentage (89%)
- [ ] Visual comparison chart

#### 10. Transaction Success
- [ ] Success modal with QR code
- [ ] Etherscan link
- [ ] Transaction hash
- [ ] Share buttons

#### 11. Etherscan Page
- [ ] Transaction details
- [ ] Block confirmation
- [ ] Gas used
- [ ] Status: Success

#### 12. Audit Export
- [ ] CSV preview in Excel/Google Sheets
- [ ] JSON preview in text editor
- [ ] Export statistics

#### 13. User Guide
- [ ] 5 tutorial steps
- [ ] Indonesian text
- [ ] Navigation buttons
- [ ] Illustrations

#### 14. STC Ecosystem
- [ ] All 12 apps grid
- [ ] Category badges
- [ ] Launch buttons
- [ ] STC Ultimate highlighted

---

## 🎥 Video Recording Tips

### Recommended Video Captures

1. **Full Journey Walkthrough (5-10 minutes)**
   - Start to finish: destination selection → journey complete
   - Real-time mode untuk authenticity
   - Narrate key actions in English/Indonesian

2. **MetaMask Integration (1-2 minutes)**
   - Focus on wallet connect
   - Transaction signing
   - Etherscan verification

3. **Sequential IoT Triggers (3-5 minutes)**
   - Close-up pada IoT engine
   - Show 5-stage verification
   - Live event log streaming

4. **Analytics & Export (2-3 minutes)**
   - Dashboard walkthrough
   - CSV/JSON export demo
   - Open files to show contents

### Recording Tools
- **OBS Studio** (free, professional)
- **Loom** (easy, cloud-based)
- **QuickTime** (Mac built-in)
- **Windows Game Bar** (Windows built-in)

---

## ✅ Final Verification Checklist

Before submitting for academic review:

### Functionality
- [ ] All 4 phases working end-to-end
- [ ] Real Sepolia transactions confirmed
- [ ] All Etherscan links valid
- [ ] CSV/JSON exports complete
- [ ] No console errors

### Documentation
- [ ] README complete
- [ ] Architecture docs written
- [ ] Testing guide (this file) complete
- [ ] API docs available
- [ ] Comments in code

### Academic Requirements
- [ ] Performance metrics collected
- [ ] Cost comparison data gathered
- [ ] IPFS proofs validated
- [ ] Multi-vendor distribution proven
- [ ] Screenshots collected (14+)
- [ ] Video demo recorded (optional)

### Repository
- [ ] Code pushed to GitHub
- [ ] All docs in /docs folder
- [ ] .gitignore configured
- [ ] License file included
- [ ] README badges working

---

## 📞 Support

If you encounter issues during testing:

1. **Check Console** - Open browser DevTools (F12) for error messages
2. **Review Docs** - Reread relevant documentation sections
3. **GitHub Issues** - Search existing issues or create new one
4. **Contact Team** - Reach out via project contacts

---

**Happy Testing!** 🚀

Last Updated: 2025
Version: 1.0.0
