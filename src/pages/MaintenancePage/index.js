import React from 'react';
import './index.css';
import { Navbar, MinecraftText, PageLayout } from 'components';
import { APP } from 'constants/app';
import * as Utils from 'utils';

/*
* Page that displays to users that visit the site while it is under maintenance
*/
export function MaintenancePage(props) {
    const data = APP.maintenance;
    const atDate = new Date(data.at);

    return (
        <PageLayout
        header={<Navbar />} 
        top={
            <MinecraftText className="text-shadow" size="xl">
                §d25Karma §cis under maintenance.
            </MinecraftText>
        }
        center={
            <React.Fragment>
                <div className="maintenancepage-message mt-3 p-2">
                    <p>Hello!</p>
                    <p>
                        {`
                        Unfortunately, 25Karma has been under maintenance since 
                        ${data.at} (${Utils.timeSince(atDate.getTime())} ago). I expect to 
                        have the site back up and running in ${data.eta}, so check back soon!
                        `}
                    </p>
                </div>
                {Boolean(data.memo) &&
                    <React.Fragment> 
                        <p className="pl-2 font-md mt-3 mb-1">A note from the developer</p>
                        <div className="maintenancepage-message p-2">
                            <p>{data.memo}</p>
                            <br />
                            <i>-Amos</i>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        } />
    );
}