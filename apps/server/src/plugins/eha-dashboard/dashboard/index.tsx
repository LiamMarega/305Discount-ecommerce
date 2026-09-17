import {defineDashboardExtension} from '@vendure/dashboard';
import './styles.css';

const brand = {
    name: '305 Discount',
    logo: './brand/logo.svg',
    logoLight: './brand/logo-light.svg',
    logoSingle: './brand/logo_single.svg',
    logoSingleBg: './brand/logo_single_bg.svg',
};

function BrandLoginLogo() {
    return (
        <div className="eha-login-logo" aria-label={brand.name}>
            <img src={brand.logoLight} alt={brand.name} className="eha-login-logo__wordmark" />
        </div>
    );
}

function BrandLoginIntro() {
    return (
        <div className="eha-login-intro">
            <p className="eha-login-intro__eyebrow">305 Discount · Admin dashboard</p>
        </div>
    );
}

function BrandLoginFooter() {
    return <p className="eha-login-footer">Secure internal access · {brand.name}</p>;
}

defineDashboardExtension({
    login: {
        logo: {
            component: BrandLoginLogo,
        },
        beforeForm: {
            component: BrandLoginIntro,
        },
        afterForm: {
            component: BrandLoginFooter,
        },
    },
});
