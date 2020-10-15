import React from 'react';

const chunkArray = (array, chunkSize) => {
    const chunkedArray = [];
    for (let index = 0; index < array.length; index += chunkSize) {
        chunkedArray.push(array.slice(index, index + chunkSize));
    }
    return chunkedArray;
};

const cdsToolLinks = [
    {name: 'DDI-CDS Home', link: 'https://ddi-cds.org/'},
    {name: 'Drug-drug Interaction Algorithms', link: 'https://ddi-cds.org/ddi-algorithms/'},
    {name: 'About Us', link: 'https://ddi-cds.org/about-us/'},
    {name: 'Recommended Approaches', link: 'https://ddi-cds.org/recommended-approaches//'},
    {name: 'Privacy Policy', link: 'https://ddi-cds.org/privacy-policy/'},
    {name: 'Webinars', link: 'https://ddi-cds.org/resources/'},
];

function CdsToolLinks({className, numRows}) {
    const cdsToolLinksChunked = chunkArray(cdsToolLinks, numRows);
    return (
        <div className={className}>
            {cdsToolLinksChunked.map((row, index) => (
                <div key={index}>
                    {row.map((link, linkIndex) => (
                        <a key={`${index}-${linkIndex}`} href={link.link}>{link.name}</a>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default function CdsFooter() {
    return (
        <footer className="cds-footer">
            <div className="cds-footer__container">
                <div className="cds-footer__column">
                    {/*<div className="cds-footer__header">*/}
                    {/*    <img*/}
                    {/*        src={`${process.env.PUBLIC_URL}/assets/images/cds-connect-logo.png`}*/}
                    {/*        height="35"*/}
                    {/*        alt="CDS Connect"*/}
                    {/*    /> Clinical Decision Support (CDS)*/}
                    {/*</div>*/}

                    <CdsToolLinks className="cds-footer__links footer-wide" numRows={2}/>
                    <CdsToolLinks className="cds-footer__links footer-mobile" numRows={5}/>
                </div>
            </div>
        </footer>
    );
}
