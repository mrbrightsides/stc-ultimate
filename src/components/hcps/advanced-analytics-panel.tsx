'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  DollarSign,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Loader2
} from 'lucide-react';
import { advancedAnalytics } from '@/lib/phase3-advanced-analytics';
import type { AnalyticsReport } from '@/lib/phase3-advanced-analytics';

export function AdvancedAnalyticsPanel() {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  
  const analytics = advancedAnalytics.getAnalytics();
  const mlModels = advancedAnalytics.getMLModels();

  const handleGenerateReport = async (type: 'daily' | 'weekly' | 'monthly' | 'quarterly') => {
    setGenerating(true);
    try {
      const generated = await advancedAnalytics.generateReport(type);
      setReport(generated);
    } finally {
      setGenerating(false);
    }
  };

  const getStatusIcon = (status: 'positive' | 'negative' | 'neutral') => {
    switch (status) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm text-green-400 mt-1">
              <TrendingUp className="w-3 h-3" />
              +{analytics.overview.growthRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.overview.revenue / 1000000000).toFixed(2)}B IDR
            </div>
            <div className="flex items-center gap-1 text-sm text-green-400 mt-1">
              <TrendingUp className="w-3 h-3" />
              +{analytics.overview.growthRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Conversion Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{analytics.overview.conversionRate}%</div>
            <div className="text-sm text-muted-foreground mt-1">Industry avg: 8.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>NPS Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{analytics.overview.npsScore}</div>
            <div className="text-sm text-muted-foreground mt-1">Excellent (70+)</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="business">Business Metrics</TabsTrigger>
          <TabsTrigger value="ml-models">ML Models</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          {/* Demand Forecasting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Demand Forecasting
              </CardTitle>
              <CardDescription>AI-powered predictions for destination popularity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.predictions.demandForecasting.map((forecast) => (
                  <div key={forecast.destination} className="p-4 border border-muted rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{forecast.destination}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>Current: {forecast.currentDemand}</span>
                          <span>→</span>
                          <span>Predicted: {forecast.predictedDemand}</span>
                        </div>
                      </div>
                      <Badge variant={
                        forecast.trend === 'up' ? 'default' : 
                        forecast.trend === 'down' ? 'destructive' : 
                        'secondary'
                      }>
                        {forecast.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                        {forecast.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                        {forecast.trend.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-semibold">{forecast.confidence}%</span>
                      </div>
                      <Progress value={forecast.confidence} />
                      <div className="flex flex-wrap gap-1 mt-2">
                        {forecast.seasonalFactors.map((factor) => (
                          <Badge key={factor} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Churn Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Churn Prediction
              </CardTitle>
              <CardDescription>Identify users at risk of leaving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                  <div className="text-3xl font-bold text-yellow-400">
                    {analytics.predictions.churnPrediction.totalAtRisk}
                  </div>
                  <div className="text-sm text-muted-foreground">Users at Risk</div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {analytics.predictions.churnPrediction.riskCategories.map((category) => (
                    <Card key={category.risk}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base capitalize">{category.risk} Risk</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-2">{category.users}</div>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {category.factors.map((factor, idx) => (
                            <li key={idx}>• {factor}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Prevention Recommendations</h4>
                  <ul className="space-y-1 text-sm">
                    {analytics.predictions.churnPrediction.preventionRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Price Optimization
              </CardTitle>
              <CardDescription>ML-recommended pricing for maximum revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.predictions.priceOptimization.map((opt) => (
                  <div key={opt.destination} className="flex items-center justify-between p-3 border border-muted rounded-lg">
                    <div>
                      <div className="font-semibold">{opt.destination}</div>
                      <div className="text-sm text-muted-foreground">
                        Current: {opt.currentPrice.toLocaleString()} IDR
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        {opt.optimalPrice.toLocaleString()} IDR
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +{opt.expectedIncrease.toFixed(1)}% revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Journey Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.userBehavior.userJourney.map((stage, idx) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between p-3 border border-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-sm font-semibold text-cyan-400">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{stage.stage}</div>
                          <div className="text-sm text-muted-foreground">
                            {stage.users.toLocaleString()} users • {stage.averageTime.toFixed(1)} min avg
                          </div>
                        </div>
                      </div>
                      <Badge variant={stage.dropoffRate > 15 ? 'destructive' : 'secondary'}>
                        {stage.dropoffRate}% dropoff
                      </Badge>
                    </div>
                    {idx < analytics.userBehavior.userJourney.length - 1 && (
                      <div className="h-4 w-0.5 bg-muted mx-auto" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.userBehavior.popularFeatures.map((feature) => (
                  <div key={feature.feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{feature.feature}</span>
                      <Badge variant="outline">{feature.usage.toLocaleString()} uses</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground mb-1">Engagement</div>
                        <Progress value={feature.engagement} className="h-2" />
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Satisfaction</div>
                        <div className="text-cyan-400 font-semibold">{feature.satisfaction}/5.0</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Metrics Tab */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.businessMetrics.revenue.byCategory.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between p-3 border border-muted rounded-lg">
                    <div>
                      <div className="font-semibold">{cat.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {(cat.amount / 1000000000).toFixed(2)}B IDR
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{cat.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing SME Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.businessMetrics.smePerformance.topPerformers.map((sme, idx) => (
                  <div key={sme.name} className="flex items-center justify-between p-3 border border-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{sme.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {sme.bookings} bookings • {sme.rating}★
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{(sme.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-muted-foreground">IDR</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML Models Tab */}
        <TabsContent value="ml-models" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {mlModels.map((model) => (
              <Card key={model.modelName}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{model.modelName}</CardTitle>
                      <CardDescription>{model.type}</CardDescription>
                    </div>
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Accuracy</div>
                      <div className="text-lg font-bold text-green-400">{model.accuracy}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">F1 Score</div>
                      <div className="text-lg font-bold text-cyan-400">{model.f1Score}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Precision</div>
                      <div className="text-lg font-bold">{model.precision}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Recall</div>
                      <div className="text-lg font-bold">{model.recall}%</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Training Data</span>
                      <span>{model.dataPoints.toLocaleString()} points</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Last Updated</span>
                      <span>{new Date(model.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {model.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {model.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{model.features.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Generate Analytics Report
              </CardTitle>
              <CardDescription>AI-powered insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-3">
                {(['daily', 'weekly', 'monthly', 'quarterly'] as const).map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    onClick={() => handleGenerateReport(type)}
                    disabled={generating}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {generating && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-4" />
                <p className="text-muted-foreground">Generating comprehensive analytics report...</p>
              </CardContent>
            </Card>
          )}

          {report && !generating && (
            <Card>
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>
                  Generated {new Date(report.generatedAt).toLocaleString()} • 
                  Period: {new Date(report.period.start).toLocaleDateString()} - {new Date(report.period.end).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div>
                  <h4 className="font-semibold mb-3">Key Metrics</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {report.keyMetrics.map((metric) => (
                      <div key={metric.metric} className="p-3 border border-muted rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">{metric.metric}</span>
                          {getStatusIcon(metric.status)}
                        </div>
                        <div className="text-xl font-bold">{metric.value.toLocaleString()}</div>
                        <div className={`text-sm ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400" />
                    AI Insights
                  </h4>
                  <ul className="space-y-2">
                    {report.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {report.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400 mt-0.5 flex-shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
