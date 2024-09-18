import { Menubar } from 'primereact/menubar';

export default function Navbar() {

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home'
        },
        {
            label: 'About',
            icon: 'pi pi-info'
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope'
        },
    ];

    return (
        <Menubar model={items} />
    );
}
