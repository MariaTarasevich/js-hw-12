class User {
    constructor({ id, name, email, address, phone }) {
        this.date = { id, name, email, address, phone }
        this.editMode = false
    }

    edit({ id, name, email, address, phone }) {
        this.date = { id, name, email, address, phone }
    }

    get() {
        return this.date
    }
}

class Contacts {
    constructor() {
        this.contactsData = [];
    }

    add({ name, email, address, phone }) {
        const user = new User({
            id: Date.now(),
            name,
            email,
            address,
            phone,
        })

        this.contactsData.push(user);
    }

    remove(idContact) {
        // this.contactsData.find(({id}) => id !== idContact)        
        // this.contactsData = this.contactsData.filter((contact) => contact.date.id != idContact)
        this.contactsData = this.contactsData.filter(({ date: { id } }) => id != idContact)
    }


    edit(idContact, newContactDate) {
        const userFound = this.contactsData.find(({ date: { id } }) => id == idContact)
        if (!userFound) return;
        userFound.edit(newContactDate)
    }

    get() {
        return this.contactsData
    }
}

class ContactsApp extends Contacts {
    constructor() {
        super();
        this.inputName;
        this.inputPhone;
        this.inputEmail;
        this.inputAddress;
        this.addButton;
        this.app;
        this.createHTML();
        this.addEvent();
    }

    createHTML() {

        const contcatOption = document.createElement('div');
        contcatOption.classList.add('contacts__options');

        this.app = document.createElement('div');
        this.inputName = document.createElement('input');
        this.inputPhone = document.createElement('input');
        this.inputEmail = document.createElement('input');
        this.inputAddress = document.createElement('input');
        this.addButton = document.createElement('button');
        this.editButton = document.createElement('button');

        this.inputName.classList.add('contact__name');
        this.inputPhone.classList.add('contact__phone');
        this.inputEmail.classList.add('contact__email');
        this.inputAddress.classList.add('contact__address');
        this.addButton.classList.add('contact__button__add');

        this.addButton.innerHTML = "Добавить контакт"

        contcatOption.appendChild(this.inputName);
        contcatOption.appendChild(this.inputPhone);
        contcatOption.appendChild(this.inputEmail);
        contcatOption.appendChild(this.inputAddress);
        contcatOption.appendChild(this.addButton);

        this.app.appendChild(contcatOption);

        this.app.classList.add('contacts')
        document.body.appendChild(this.app)

    }

    addEvent() {

        this.addButton.addEventListener('click', () => {
            this.onAdd({
                name: this.inputName.value,
                email: this.inputEmail.value,
                phone: this.inputPhone.value,
                address: this.inputAddress.value
            })

            this.inputName.value = '';
            this.inputEmail.value = '';
            this.inputPhone.value = '';
            this.inputAddress.value = ''

            return localStorage.setItem('contacts', JSON.stringify(this.contactsData))
        })
    }

    onAdd(addObj) {
        this.add(addObj);
        this.onShow();
    }

    onShow() {
        const data = this.get();
        let ul = document.querySelector('.contacts__items')

        if (!ul) {
            ul = document.createElement('ul');
            ul.classList.add('contacts__items')
        }

        let list = '';


        if (!data) return
        data.forEach(({ date: { name, address, id, email, phone }, editMode }) => {
            list += `<li class="contact__item">
                            <p>${name}</p>  
                            <p>${phone}</p>
                            <p>${address}</p>    
                            <p>${email}</p>
                            <button class="contact__item__delete" id="${id}">Удалить</button>
                            ${editMode ? "<button data-save=" + id + ">Save</button>" : '<button class="contact__item__edit" data-edit=' + id + '>Редактировать</button>'}       
                    </li>`
        })

        ul.innerHTML = list;
        this.app.appendChild(ul);
        this.onAddEventRemoveEdit();

    }

    onAddEventRemoveEdit() {
        const deleteBtn = document.querySelectorAll('.contact__item__delete')
        const editBtns = document.querySelectorAll('.contact__item__edit')

        deleteBtn.forEach((delBtn) => {
            delBtn.addEventListener('click', (event) => {
                this.onDelete(event.target.id)
            })
        })

        editBtns.forEach((editBtn) => {
            editBtn.addEventListener('click', (event) => {
                this.onEdit(event.target.dataset.edit)
            })
        })


    }

    onDelete(id) {
        this.remove(id);
        this.onShow();
    }

    onEdit(idEdit) {
        const data = this.get();
        const editusers = data.map((item) => {
            if (item.date.id == idEdit) {
                item.editMode = true
            } else {
                item.editMode = false
            }
            return item
        })
        this.addButton.setAttribute('disabled', 'true')
        // edituser.editMode = true;
        // this.onShow();
        // console.log(edituser)

        // const { name, phone, email, address } = edituser.date;

        // this.inputName.value = name;
        // this.inputPhone.value = phone;
        // this.inputEmail.value = email;
        // this.inputAddress.value = address;

        // setTimeout(()=>{
        //     this.addButton.removeAttribute('disabled');
        // },5000)

        console.log(editusers)

    }

    get() {
        return super.get()
    }

    set storage(contList) {
        localStorage.setItem('contacts', JSON.stringify(contList))
    }
    get storage(){
        return localStorage.setItem('contacts', JSON.stringify(this.contactsData))
    }
}

window.addEventListener('load', () => {
    const contacts = new ContactsApp();
    console.log(contacts);

})