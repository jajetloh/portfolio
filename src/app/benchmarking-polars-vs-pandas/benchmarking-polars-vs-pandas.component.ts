import { Component } from '@angular/core'
import { faArrowUpRightFromSquare, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faCircle } from "@fortawesome/free-regular-svg-icons"

@Component({
    selector: 'app-benchmarking-polars-vs-pandas',
    templateUrl: './benchmarking-polars-vs-pandas.component.html',
    styleUrls: ['./benchmarking-polars-vs-pandas.component.css']
})
export class BenchmarkingPolarsVsPandasComponent {

    faCheck = faCheck
    faCircle = faCircle
    faXmark = faXmark

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
    protected readonly faArrowUpRightFromSquare = faArrowUpRightFromSquare
}


