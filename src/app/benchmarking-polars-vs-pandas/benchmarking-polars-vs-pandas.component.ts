import {Component, OnInit} from '@angular/core'
import {
    faAngleDoubleDown, faAngleDown, faAngleUp, faArrowDown, faArrowUp,
    faArrowUpRightFromSquare, faChartSimple,
    faCheck, faChevronDown,
    faChevronUp,
    faCircleChevronUp,
    faXmark
} from "@fortawesome/free-solid-svg-icons"
import { faCircle } from "@fortawesome/free-regular-svg-icons"
import * as performanceData from '../../assets/performance-results.json'
import {groupBy, mean, sum} from 'lodash-es'
import {ViewportScroller} from "@angular/common";

@Component({
    selector: 'app-benchmarking-polars-vs-pandas',
    templateUrl: './benchmarking-polars-vs-pandas.component.html',
    styleUrls: ['./benchmarking-polars-vs-pandas.component.css']
})
export class BenchmarkingPolarsVsPandasComponent implements OnInit {

    faCheck = faCheck
    faCircle = faCircle
    faXmark = faXmark
    protected readonly faChevronUp = faChevronUp
    protected readonly faChevronDown = faChevronDown

    dataCacheCases : {[k: string]: any} = {}
    dataCacheLevel1Groups : {[k: string]: any} = {}
    dataCacheLevel2Groups : {[k: string]: any} = {}

    showSection: {[k: string]: boolean} = {}
    showGraph: {[k: string]: boolean} = {}

    showPerformanceRows = true
    performanceData: any[] = (performanceData as any).default.filter((x: any) => x['PROPERTY_2'] > 10000)

    showChart = false

    tableDef = [
        {
            name: 'IO',
            level: 1,
            children: [
                {
                    name: 'Write',
                    level: 2,
                    children: [
                        { name: 'write-csv', level: 3 },
                        { name: 'write-ipc', level: 3 },
                        { name: 'write-parquet', level: 3 },
                    ],
                },
                {
                    name: 'Read',
                    level: 2,
                    children: [
                        { name: 'read-csv', level: 3 },
                        { name: 'read-ipc', level: 3 },
                        { name: 'read-parquet', level: 3 },
                    ],
                },
            ],
        },
        {
            name: 'Calculated Columns',
            level: 1,
            children: [
                {
                    name: 'Arithmetic',
                    level: 2,
                    children: [
                        { name: 'arithmetic-simple', level: 3 },
                        { name: 'arithmetic-advanced', level: 3 },
                    ],
                },
                {
                    name: 'String Operations',
                    level: 2,
                    children: [
                        { name: 'string-ops', level: 3 },
                        { name: 'string-regex', level: 3 },
                        { name: 'string-to-datetime', level: 3 },
                    ],
                },
            ],
        },
        {
            name: 'General Calculations',
            level: 1,
            children: [
                {
                    name: 'Sorting',
                    level: 2,
                    children: [
                        { name: 'sort', level: 3 },
                    ],
                },
                {
                    name: 'Unique',
                    level: 2,
                    children: [
                        { name: 'unique', level: 3 },
                    ],
                },
                {
                    name: 'Group and Aggregate',
                    level: 2,
                    children: [
                        { name: 'group-and-agg', level: 3 },
                    ],
                },
                {
                    name: 'Window Expressions',
                    level: 2,
                    children: [
                        { name: 'window-functions', level: 3 },
                        { name: 'cumulative-functions', level: 3 },
                    ],
                },
            ],
        },
        {
            name: 'Joins and Concatenation',
            level: 1,
            children: [
                {
                    name: 'Joins',
                    level: 2,
                    children: [
                        { name: 'left-join', level: 3 },
                        { name: 'join-asof', level: 3 },
                    ],
                },
                {
                    name: 'Concatenation',
                    level: 2,
                    children: [
                        { name: 'vertical-union', level: 3 },
                    ],
                },
            ],
        },
        {
            name: 'Example Cases',
            level: 1,
            children: [
                {
                    name: 'Case 1',
                    level: 2,
                    children: [
                        { name: 'transformations', level: 3 },
                    ],
                },
            ],
        }
    ]

    graph = {
        data: [
            { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
            { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
        ],
        layout: {title: 'A Fancy Plot', autosize: true},
    }
    noModeBarsConfig = {
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'toImage']
    }

    codePandas1 = `# Pandas - 83 s runtime
pd_session_agg_df = pd_df.copy()
pd_session_agg_df['event_time'] = pd.to_datetime(pd_df['event_time'], format='%Y-%m-%d %H:%M:%S UTC')
pd_session_agg_df = pd_session_agg_df.groupby(['user_id', 'user_session']).agg({
    'event_time': ['min', 'max'],
})
pd_session_agg_df['session_duration_secs'] = (pd_session_agg_df[('event_time', 'max')] - pd_session_agg_df[('event_time', 'min')]).dt.total_seconds()`

    codePolars1 = `# Polars - 24 s runtime (3.5x shorter)
pl_session_agg_df = pl_df.lazy().with_columns([
    pl.col('event_time').str.strptime(pl.Datetime('ms'), '%Y-%m-%d %H:%M:%S UTC')
]).group_by(['user_id', 'user_session']).agg([
    pl.col('event_time').min().alias('session_start_time'),
    pl.col('event_time').max().alias('session_end_time'),
]).with_columns([
    (pl.col('session_end_time') - pl.col('session_start_time')).dt.seconds().alias('session_duration_secs'),
]).collect()`

    codePandas2 = `# Pandas - 33.6 s runtime
pd_between_sessions_df = pd_session_agg_df.reset_index()
pd_between_sessions_df.columns = [k1 if k2 == '' else f'{k1}_{k2}' for k1, k2 in pd_between_sessions_df]
unique_sessions_per_user = pd_between_sessions_df.groupby('user_id')['user_session'].nunique().reset_index().rename(columns={'user_session': 'unique_session_for_user'})
pd_between_sessions_df = pd_between_sessions_df.merge(unique_sessions_per_user, on='user_id', how='left')
pd_between_sessions_df['prev_session_end_time'] = pd_between_sessions_df.sort_values('event_time_min').groupby('user_id')['event_time_max'].shift(1)
pd_between_sessions_df['next_session_start_time'] = pd_between_sessions_df.sort_values('event_time_min').groupby('user_id')['event_time_min'].shift(-1)
pd_between_sessions_df['hrs_from_last_session'] = (pd_between_sessions_df['event_time_min'] - pd_between_sessions_df['prev_session_end_time']).dt.total_seconds() / 3600
pd_between_sessions_df['hrs_to_next_session'] = (pd_between_sessions_df['next_session_start_time'] - pd_between_sessions_df['event_time_max']).dt.total_seconds() / 3600`

    codePolars2 = `# Polars - 11.7s runtime
pl_between_sessions_df = pl_session_agg_df.lazy().with_columns([
    pl.col('user_session').n_unique().over('user_id').alias('unique_sessions_for_user'),
    pl.col('session_end_time').sort_by('session_start_time', descending=False).shift(1).over('user_id').alias('prev_session_end_time'),
    pl.col('session_start_time').sort_by('session_start_time', descending=False).shift(-1).over('user_id').alias('next_session_start_time'),
]).with_columns([
    (pl.col('session_start_time') - pl.col('prev_session_end_time')).dt.seconds().truediv(3600).alias('hrs_from_last_session'),
    (pl.col('next_session_start_time') - pl.col('session_start_time')).dt.seconds().truediv(3600).alias('hrs_to_next_session'),
]).collect()`

    constructor(private viewportScroller: ViewportScroller) {
        this.viewportScroller.setOffset([0,40])
    }

    scrollToSelector(id: string) {
        console.log(123)
        this.viewportScroller.scrollToAnchor(id)
    }

    ngOnInit() {
    }


    getLevel1Data(level1Name: string): { pandasSum: number, polarsSum: number, ratio: number, plotData: any, plotLayout: any, pandasSample: number, polarsSample: number } {
        if (level1Name in this.dataCacheLevel1Groups) {
            return this.dataCacheLevel1Groups[level1Name]
        }

        let caseNames = this.performanceData.filter(r => r['CASE_CAT_1'] === level1Name).map(r => r['CASE_NAME']).filter((v,i,a) => a.indexOf(v) === i)
        let cat2Names = this.performanceData.filter(r => r['CASE_CAT_1'] === level1Name).map(r => r['CASE_CAT_2']).filter((v,i,a) => a.indexOf(v) === i)
        let ratio = Math.pow(cat2Names.map(r => this.getLevel2Data(r).ratio).reduce((p,c) => p*c, 1), 1/cat2Names.length)
        let relevantRecords = this.performanceData.filter(v => caseNames.includes(v['CASE_NAME']))
        let pandasGrouped = groupBy(relevantRecords.filter(v => v['PROPERTY_1'] === 'pandas'), 'PROPERTY_2')
        let pandasSums = Object.entries(pandasGrouped).map(([k,v]) => [Number(k), v.reduce((p,c) => p+c['VALUE'], 0)])
        let pandasSample = sum(cat2Names.map(r => this.getLevel2Data(r).pandasSample))
        let polarsGrouped = groupBy(relevantRecords.filter(v => v['PROPERTY_1'] === 'polars'), 'PROPERTY_2')
        let polarsSums = Object.entries(polarsGrouped).map(([k,v]) => [Number(k), v.reduce((p,c) => p+c['VALUE'], 0)])
        let polarsSample = sum(cat2Names.map(r => this.getLevel2Data(r).polarsSample))

        let plotData = [
            {
                name: 'Pandas',
                type: 'scatter',
                mode: 'markers+lines',
                x: pandasSums.map(r => r[0]),
                y: pandasSums.map(r => r[1]),
            },
            {
                name: 'Polars',
                type: 'scatter',
                mode: 'markers+lines',
                x: polarsSums.map(r => r[0]),
                y: polarsSums.map(r => r[1]),
            },
        ]
        let plotLayout = {
            title: `${level1Name} Performance over Dataset Size`,
            xaxis: {type: 'log', title: 'Number of Rows'},
            yaxis: {type: 'log', title: 'Total Duration (seconds)'},
        }
        this.dataCacheLevel1Groups[level1Name] = { pandasSum: sum(pandasSums.map(r => r[1])), polarsSum: sum(polarsSums.map(r => r[1])), ratio, plotData, plotLayout, pandasSample, polarsSample }
        return this.dataCacheLevel1Groups[level1Name]
    }
    getLevel2Data(level2Name: string): { pandasSum: number, polarsSum: number, ratio: number, plotData: any, plotLayout: any, pandasSample: number, polarsSample: number } {
        if (level2Name in this.dataCacheLevel2Groups) {
            return this.dataCacheLevel2Groups[level2Name]
        }

        let caseNames = this.performanceData.filter(r => r['CASE_CAT_2'] === level2Name).map(r => r['CASE_NAME']).filter((v,i,a) => a.indexOf(v) === i)
        let ratio = Math.pow(caseNames.map(r => this.getCaseData(r).ratio).reduce((p,c) => p*c, 1), 1/caseNames.length)
        let relevantRecords = this.performanceData.filter(v => caseNames.includes(v['CASE_NAME']))
        let pandasGrouped = groupBy(relevantRecords.filter(v => v['PROPERTY_1'] === 'pandas'), 'PROPERTY_2')
        let pandasSums = Object.entries(pandasGrouped).map(([k,v]) => [Number(k), v.reduce((p,c) => p+c['VALUE'], 0)])
        let pandasSample = sum(caseNames.map(r => this.getCaseData(r).pandasSample))
        let polarsGrouped = groupBy(relevantRecords.filter(v => v['PROPERTY_1'] === 'polars'), 'PROPERTY_2')
        let polarsSums = Object.entries(polarsGrouped).map(([k,v]) => [Number(k), v.reduce((p,c) => p+c['VALUE'], 0)])
        let polarsSample = sum(caseNames.map(r => this.getCaseData(r).polarsSample))

        let plotData = [
            {
                name: 'Pandas',
                type: 'scatter',
                mode: 'markers+lines',
                x: pandasSums.map(r => r[0]),
                y: pandasSums.map(r => r[1]),
            },
            {
                name: 'Polars',
                type: 'scatter',
                mode: 'markers+lines',
                x: polarsSums.map(r => r[0]),
                y: polarsSums.map(r => r[1]),
            },
        ]
        let plotLayout = {
            title: `${level2Name} Performance over Dataset Size`,
            xaxis: {type: 'log', title: 'Number of Rows'},
            yaxis: {type: 'log', title: 'Total Duration (seconds)'},
        }
        this.dataCacheLevel2Groups[level2Name] = { pandasSum: sum(pandasSums.map(r => r[1])), polarsSum: sum(polarsSums.map(r => r[1])), ratio, plotData, plotLayout, pandasSample, polarsSample }
        return this.dataCacheLevel2Groups[level2Name]
    }

    getCaseData(caseName: string): { pandasSum: number, polarsSum: number, ratio: number, plotData: any, plotLayout: any, pandasSample: number, polarsSample: number } {
        if (caseName in this.dataCacheCases) {
            return this.dataCacheCases[caseName]
        }
        let caseValues = this.performanceData.filter(r => r['CASE_NAME'] == caseName)
        const sample_at = 973822
        // @ts-ignore .toSorted error
        let pandasValues: any[] = caseValues.filter(r => r['PROPERTY_1'] == 'pandas').toSorted((a: any, b: any) => a['PROPERTY_2']-b['PROPERTY_2'])
        let pandasSum = pandasValues.map(v => v['VALUE']).reduce((p: number, c: number) => p+c, 0)
        let pandasSample = pandasValues.filter(x => x['PROPERTY_2'] === sample_at)[0]['VALUE']
        // @ts-ignore .toSorted error
        let polarsValues: any[] = caseValues.filter(r => r['PROPERTY_1'] == 'polars').toSorted((a: any, b: any) => a['PROPERTY_2']-b['PROPERTY_2'])
        let polarsSum = polarsValues.map(v => v['VALUE']).reduce((p: number, c: number) => p+c, 0)
        let polarsSample = polarsValues.filter(x => x['PROPERTY_2'] === sample_at)[0]['VALUE']

        const polarsDurationMap = polarsValues.reduce((p,c) => {p[c['PROPERTY_2']]=c['VALUE']; return p}, {})
        const ratio = Math.pow(pandasValues.map(x => polarsDurationMap[x['PROPERTY_2']]/x['VALUE']).reduce((p,c) => p*c,1), 1/pandasValues.length)
        // let ratio = pandasSum / polarsSum

        let plotData = [
            {
                name: 'Pandas',
                type: 'scatter',
                mode: 'markers+lines',
                x: pandasValues.map(v => v['PROPERTY_2']),
                y: pandasValues.map(v => v['VALUE']),
            },
            {
                name: 'Polars',
                type: 'scatter',
                mode: 'markers+lines',
                x: polarsValues.map(v => v['PROPERTY_2']),
                y: polarsValues.map(v => v['VALUE']),
            },
        ]
        let plotLayout = {
            title: `${caseName} Performance over Dataset Size`,
            xaxis: {type: 'log', title: 'Number of Rows'},
            yaxis: {type: 'log', title: 'Duration (seconds)'},
        }
        this.dataCacheCases[caseName] = { pandasSum, polarsSum, pandasSample, polarsSample, ratio, plotData, plotLayout }
        return this.dataCacheCases[caseName]
    }

    treatRatio(n: number) {
        const isIncrease = n >= 1
        const factor = (isIncrease ? n : 1/n).toFixed(2)
        return { isIncrease, factor }
    }

    formatSeconds(n: number): string {
        if (n < 1e-6) {
            return `${(n * 1e9).toFixed()} ns`
        } else if (n < 1e-3) {
            return `${(n * 1e6).toFixed()} μs`
        } else if (n < 1) {
            return `${(n * 1e3).toFixed()} ms`
        } else {
            return `${n.toFixed()} s`
        }
    }

    protected readonly faChartSimple = faChartSimple;
    protected readonly faAngleDoubleDown = faAngleDoubleDown;
    protected readonly faAngleDown = faAngleDown;
    protected readonly faAngleUp = faAngleUp;
    protected readonly faArrowUp = faArrowUp;
    protected readonly faArrowDown = faArrowDown;
}


