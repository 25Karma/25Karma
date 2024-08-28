import React from 'react';
import './index.css';
import { MinecraftText, PageLayout } from 'src/components';
import { MAINTENANCE } from 'src/constants/app';
import * as Utils from 'src/utils';

/**
 * Page that displays to users that visit the site while it is under maintenance
 */
export function MaintenancePage() {
    const atDate = new Date(MAINTENANCE.at);

    return (
        <PageLayout
        top={
            <MinecraftText className="text-shadow" size="xl">
                §d25Karma §cis under maintenance.
            </MinecraftText>
        }
        center={
            <React.Fragment>
                <div className="maintenancepage-message mt-3 p-2">
                    <p className="font-bold">Hello!</p>
                    <p>
                        {`
                        Unfortunately, 25Karma has been under maintenance since 
                        ${MAINTENANCE.at} (${Utils.timeSince(atDate.getTime())} ago). I expect to 
                        have the site back up and running in ${MAINTENANCE.eta}, so check back soon!
                        `}
                    </p>
                </div>
                {Boolean(MAINTENANCE.memo) &&
                    <React.Fragment> 
                        <p className="pl-2 font-bold mt-3 mb-1">A note from the developer</p>
                        <div className="maintenancepage-message p-2">
                            <p>{MAINTENANCE.memo}</p>
                            <br />
                            <i>-Amos</i>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        } />
    );
}