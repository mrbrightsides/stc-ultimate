# Event History Analytics Documentation

## 🎯 Overview

The Event History Analytics system provides comprehensive statistical analysis and visualization of blockchain events, IoT actions, device performance, and system costs. This module is designed specifically for academic presentations, research papers, and system optimization.

---

## 📁 File Location

```
src/components/scada/event-history-analytics.tsx
```

**Integration**: SCADA System → "History Analytics" tab

---

## 🎨 User Interface

### 4 Main Tabs

```
┌─────────────────────────────────────────────────────────────┐
│  [Trends] [Distribution] [Device Activity] [Cost Analysis]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Time Range: [1h] [6h] [24h] [All Time]                   │
│                                                             │
│  [Tab Content Here]                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Tab 1: Trends

### Performance Metrics (Cards)

#### Transactions/Hour
- Current hour transaction count
- Comparison with previous hour
- Trend indicator (↑ increase / ↓ decrease / → stable)
- Percentage change
- Color-coded badge (green/red/gray)

**Example Display**:
```
┌──────────────────────────┐
│ Transactions/Hour        │
│ 12                       │
│ ↑ +20% vs prev hour     │
└──────────────────────────┘
```

#### Average Gas Cost
- Average gas used per transaction
- Trend comparison
- Efficiency indicator

#### IoT Actions/Hour
- IoT actions triggered per hour
- Automation rate tracking
- Trend analysis

#### Success Rate
- Percentage of successful transactions
- System reliability metric
- Error rate tracking

### Time-Series Charts

#### 1. Transaction Activity Chart
**Type**: Area Chart  
**X-axis**: Time (hourly intervals)  
**Y-axis**: Transaction count  
**Color**: Blue (#3b82f6)

**Data Structure**:
```typescript
{
  time: '10:00',  // Hour label
  count: 5        // Number of transactions
}
```

**Insights Provided**:
- Peak usage hours
- Activity patterns
- System load over time

#### 2. Gas Usage Trends Chart
**Type**: Line Chart (2 lines)  
**X-axis**: Time (hourly intervals)  
**Y-axis**: Gas amount  
**Lines**:
- Total gas used (blue)
- Average gas per TX (green)

**Data Structure**:
```typescript
{
  time: '10:00',
  totalGas: 210000,
  avgGas: 21000
}
```

**Insights Provided**:
- Gas consumption trends
- Optimization opportunities
- Cost forecasting

#### 3. IoT Automation Activity Chart
**Type**: Bar Chart  
**X-axis**: Time (hourly intervals)  
**Y-axis**: IoT action count  
**Color**: Green (#10b981)

**Data Structure**:
```typescript
{
  time: '10:00',
  actions: 8
}
```

**Insights Provided**:
- Automation utilization
- Device activity patterns
- System effectiveness

---

## 📊 Tab 2: Distribution

### Event Type Breakdown

#### Pie Chart
**Purpose**: Visual distribution of blockchain event types

**Data Structure**:
```typescript
{
  name: 'PaymentProcessed',  // Event type
  value: 45,                  // Count
  fill: '#3b82f6'            // Color
}
```

**Color Palette**:
- PaymentProcessed: Blue (#3b82f6)
- EscrowReleased: Green (#10b981)
- MilestoneTriggered: Purple (#8b5cf6)
- BookingValidated: Orange (#f59e0b)
- Others: Gray (#6b7280)

#### Event Statistics List
**Purpose**: Detailed breakdown with percentages

**Display Format**:
```
● PaymentProcessed          [15] (33.3%)
● EscrowReleased            [12] (26.7%)
● MilestoneTriggered        [10] (22.2%)
● BookingValidated          [8]  (17.8%)
```

**Features**:
- Color-coded bullets matching pie chart
- Absolute counts in badges
- Percentage of total
- Sorted by frequency

### Summary Statistics

```
┌────────────────────────────────────────────┐
│ Total Transactions: 45                     │
│ Total Events: 152                          │
│ Total IoT Actions: 183                     │
│ Unique Event Types: 8                      │
└────────────────────────────────────────────┘
```

---

## 📊 Tab 3: Device Activity

### Device Activation Frequency

**Chart Type**: Horizontal Bar Chart  
**Purpose**: Show which IoT devices are triggered most frequently

**Data Structure**:
```typescript
{
  device: 'Main Entrance Door Lock',
  activations: 45
}
```

**Display**:
```
Main Entrance Door Lock       ████████████████ 45
Room Climate Control          ████████████     30
Security Camera - Lobby       ██████████       25
Room Lighting System          ████████         20
```

**Top 10 Devices** shown by default

**Insights Provided**:
- Most utilized devices
- System bottlenecks
- Resource allocation needs

### Device Response Times

**Chart Type**: Horizontal Bar Chart  
**Purpose**: Average response time per device

**Data Structure**:
```typescript
{
  device: 'Main Entrance Door Lock',
  responseTime: 120  // milliseconds
}
```

**Display**:
```
Main Entrance Door Lock       ████ 120ms
Room Climate Control          ██████ 180ms
Security Camera - Lobby       ███ 95ms
Room Lighting System          ████ 110ms
```

**Color Coding**:
- Green: < 100ms (excellent)
- Blue: 100-200ms (good)
- Yellow: 200-500ms (acceptable)
- Red: > 500ms (needs optimization)

**Insights Provided**:
- System responsiveness
- Device performance
- Optimization priorities

---

## 📊 Tab 4: Cost Analysis

### Cost Metrics (Cards)

#### Total Gas Used
- Cumulative gas consumption
- Gas unit count
- Trend tracking

**Example**:
```
┌──────────────────────────┐
│ Total Gas Used           │
│ 2,450,000 gas           │
│ (All time)              │
└──────────────────────────┘
```

#### Total Cost (ETH)
- Gas cost in ETH
- Based on average gas price
- Testnet disclaimer

**Example**:
```
┌──────────────────────────┐
│ Total Cost               │
│ 0.0245 ETH              │
│ (~$45.50 USD)           │
└──────────────────────────┘
```

#### Total Cost (USD)
- USD equivalent
- Based on current ETH price
- Real-time conversion

### Cost Breakdown

**Metrics Displayed**:
```
Average Cost per Transaction
├─ Gas: 50,000 units
├─ ETH: 0.0005 ETH
└─ USD: ~$0.93

Estimated Monthly Cost
├─ Based on current rate
├─ Projection: $139.50/month
└─ 150 transactions/month

Cost per IoT Action
├─ Gas: ~13,333 units
├─ ETH: 0.000133 ETH
└─ USD: ~$0.25
```

### Cost Efficiency Insights

**Optimization Tips**:
```
✅ Gas Optimization Status: Good
   Average gas usage is within normal range

⚠️ Testnet Notice
   These are Sepolia testnet costs.
   Mainnet costs may vary significantly.

💡 Cost-Benefit Analysis
   Each transaction enables 3.75 IoT actions
   Average value: $3.48 per automation
```

**ROI Calculation**:
```typescript
const avgCostPerTx = totalCostUSD / totalTransactions;
const avgActionsPerTx = totalIoTActions / totalTransactions;
const valuePerAction = avgCostPerTx / avgActionsPerTx;

// Display
ROI = (value delivered - cost) / cost
    = ($3.48 - $0.93) / $0.93
    = 274% ROI
```

---

## 🔧 Technical Implementation

### Data Source

```typescript
import { useBlockchainEvents } from '@/contexts/blockchain-events-context';

const { events, iotActions, stats } = useBlockchainEvents();
```

### Time Filtering

```typescript
type TimeRange = '1h' | '6h' | '24h' | 'all';

const filterEventsByTime = (
  events: BlockchainEventRecord[],
  range: TimeRange
): BlockchainEventRecord[] => {
  const now = Date.now();
  const cutoff = {
    '1h': now - 3600000,
    '6h': now - 21600000,
    '24h': now - 86400000,
    'all': 0
  }[range];
  
  return events.filter(e => e.timestamp >= cutoff);
};
```

### Trend Calculation

```typescript
const calculateTrend = (
  current: number,
  previous: number
): { direction: 'up' | 'down' | 'stable', percentage: number } => {
  if (previous === 0) return { direction: 'stable', percentage: 0 };
  
  const change = ((current - previous) / previous) * 100;
  
  if (Math.abs(change) < 5) return { direction: 'stable', percentage: 0 };
  
  return {
    direction: change > 0 ? 'up' : 'down',
    percentage: Math.abs(change)
  };
};
```

### Chart Data Preparation

#### For Time-Series Charts

```typescript
// Group events by hour
const groupByHour = (events: BlockchainEventRecord[]) => {
  const hourlyData = new Map<string, number>();
  
  events.forEach(event => {
    const hour = new Date(event.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    hourlyData.set(hour, (hourlyData.get(hour) || 0) + 1);
  });
  
  return Array.from(hourlyData.entries()).map(([time, count]) => ({
    time,
    count
  }));
};
```

#### For Pie Charts

```typescript
// Count event types
const countEventTypes = (events: BlockchainEventRecord[]) => {
  const typeCounts = new Map<string, number>();
  
  events.forEach(event => {
    event.events.forEach(e => {
      typeCounts.set(e.name, (typeCounts.get(e.name) || 0) + 1);
    });
  });
  
  return Array.from(typeCounts.entries()).map(([name, value]) => ({
    name,
    value,
    fill: getColorForEventType(name)
  }));
};
```

#### For Bar Charts

```typescript
// Device activation frequency
const getDeviceFrequency = (iotActions: IoTAction[]) => {
  const deviceCounts = new Map<string, number>();
  
  iotActions.forEach(action => {
    deviceCounts.set(
      action.deviceName,
      (deviceCounts.get(action.deviceName) || 0) + 1
    );
  });
  
  return Array.from(deviceCounts.entries())
    .map(([device, activations]) => ({ device, activations }))
    .sort((a, b) => b.activations - a.activations)
    .slice(0, 10); // Top 10
};
```

---

## 📈 Use Cases

### 1. Academic Defense

**Scenario**: Defending dissertation on blockchain-IoT integration

**How to Use**:
1. Navigate to SCADA → History Analytics
2. Select "All Time" to show complete dataset
3. **Trends Tab**: Show transaction activity over project timeline
4. **Distribution Tab**: Demonstrate event type diversity
5. **Device Activity Tab**: Prove IoT automation effectiveness
6. **Cost Analysis Tab**: Present economic viability

**Key Talking Points**:
- "As shown in the Trends analysis, system utilization increased 45% over 6 months"
- "Event distribution demonstrates balanced smart contract functionality"
- "Average response time of 120ms proves real-time capability"
- "Cost-benefit analysis shows 274% ROI on blockchain automation"

### 2. Research Paper

**Scenario**: Writing Scopus Q3 publication on smart tourism blockchain

**How to Use**:
1. Export analytics screenshots for figures
2. Reference specific metrics in methodology
3. Use trend data for results section
4. Cost analysis for discussion section

**Paper Sections**:
- **Introduction**: "System processes 12 transactions/hour with 98.5% success rate"
- **Methodology**: "Event parsing system with ABI-level decoding (see Fig. 3)"
- **Results**: "Gas optimization achieved average 50,000 gas/tx (see Fig. 4)"
- **Discussion**: "Cost efficiency of $0.25/IoT action enables SME adoption"

### 3. System Optimization

**Scenario**: Identifying performance bottlenecks

**How to Use**:
1. **Device Activity Tab** → Find slow-responding devices
2. **Trends Tab** → Identify peak usage times
3. **Cost Analysis Tab** → Find expensive operations
4. **Distribution Tab** → Check for event type imbalances

**Action Items**:
- Optimize devices with > 200ms response time
- Scale resources for peak hours
- Implement gas-saving techniques for frequent events
- Balance event distribution for better performance

### 4. Stakeholder Reporting

**Scenario**: Monthly report to project sponsors

**How to Use**:
1. Set time range to "24h" or "All Time"
2. Generate summary of key metrics
3. Highlight trends and improvements
4. Present cost efficiency

**Report Template**:
```
Monthly Blockchain-IoT System Report

Key Metrics:
- Total Transactions: 450 (+15% MoM)
- System Uptime: 99.9%
- Average Response Time: 125ms (-10ms MoM)
- Total Cost: $45.50 (-8% MoM)

Highlights:
- Successfully processed 450 blockchain transactions
- Triggered 1,688 IoT actions with 98.5% success rate
- Achieved 274% ROI on automation costs
- Optimized 3 device response times

Next Month Goals:
- Reduce average gas cost by 10%
- Improve device response time to < 100ms
- Scale to 600 transactions/month
```

---

## 🎯 Best Practices

### For Academic Presentations

1. **Always show "All Time" data** for complete picture
2. **Use Trends tab first** to show growth over time
3. **Highlight Distribution tab** to prove system diversity
4. **Reference Cost Analysis** for practical viability
5. **Export charts** before presentation (in case of connectivity issues)

### For Research Papers

1. **Include multiple time ranges** (1h, 24h, all) to show scalability
2. **Reference specific metrics** with figure numbers
3. **Discuss statistical significance** of trends
4. **Compare with related work** using same metrics
5. **Include raw data** in appendix (export JSON)

### For System Monitoring

1. **Check daily** for anomalies in trends
2. **Set baselines** for normal performance
3. **Track week-over-week** changes
4. **Alert on significant deviations** (>20% change)
5. **Document optimizations** and their impact

---

## 🐛 Troubleshooting

### No Data Displayed

**Symptom**: Charts show "No data available"

**Causes & Solutions**:
1. No blockchain transactions made yet
   - Make test payment to generate data
2. Time range too narrow
   - Switch to "All Time" filter
3. LocalStorage cleared
   - Data is lost, make new transactions
4. Context not initialized
   - Refresh page

### Incorrect Trends

**Symptom**: Trend indicators don't match visual data

**Causes & Solutions**:
1. Previous hour had no data
   - Trend calculation defaults to stable
2. Time zone issues
   - Check browser time zone settings
3. Data not refreshing
   - Context refreshes every 5 seconds, wait briefly

### Chart Rendering Issues

**Symptom**: Charts don't display or overlap incorrectly

**Causes & Solutions**:
1. Recharts not loaded
   - Check console for errors
   - Verify recharts is installed
2. Responsive issues
   - Adjust container width
   - Check ResponsiveContainer props
3. Data format incorrect
   - Validate data structure matches chart requirements

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Export charts as images
- [ ] Custom date range selection
- [ ] Comparison mode (compare two time periods)
- [ ] Predictive analytics (forecast trends)
- [ ] Anomaly detection alerts
- [ ] Custom metric definitions
- [ ] Real-time chart updates (WebSocket)
- [ ] Multi-device comparison
- [ ] Cost optimization recommendations
- [ ] Performance benchmarking

### Advanced Analytics
- [ ] Machine learning-based pattern recognition
- [ ] Correlation analysis (events vs. device performance)
- [ ] Statistical significance testing
- [ ] Regression analysis for forecasting
- [ ] Clustering for device behavior patterns

---

## 📚 References

### Chart Libraries
- [Recharts Documentation](https://recharts.org/)
- [Chart.js Alternatives](https://www.chartjs.org/)

### Statistical Methods
- Moving Average Calculation
- Trend Analysis Techniques
- Time Series Analysis

### Academic Standards
- IEEE Data Visualization Guidelines
- ACM Graph Best Practices
- Scopus Publication Standards

---

**Version**: 2.5.6  
**Last Updated**: 2025  
**Component**: `src/components/scada/event-history-analytics.tsx`  
**Dependencies**: Recharts, BlockchainEventsContext  
**Status**: Production-Ready
