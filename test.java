package com.example.banking;

import java.util.Collections;
import javax.ejb.*;

public abstract class Bank implements javax.ejb.EntityBean {
    // Business logic...
    public abstract String getStreetAddr1();

    public abstract String getStreetAddr2();

    public abstract String getCity();

    public abstract String getState();

    public abstract String getZipCode();

    public abstract void setStreetAddr1(String street1);

    public abstract void setStreetAddr2(String street1);

    public abstract void setCity(String city);

    public abstract void setState(String state);

    public abstract void setZipCode(String zip);

    public abstract Collection getAccounts();

    public abstract void setAccounts(Collection accounts);

    public void addAccount(AccountDTO accountDTO) {
        InitialContext context = new InitialContext();
        AccountHomeLocal accountHome = context.lookup("AccountHomeLocal");
        AccountLocal account = accountHome.create(accountDTO);
        Collection accounts = getAccounts();
        accounts.add(account);
    }

    // EJB container logic
    public abstract void setId(Integer id);

    public abstract Integer getId();

    public Integer ejbCreate(Integer id) { ...}

    public void ejbPostCreate(Integer id) { ...}

    // The rest had to be implemented but were usually empty:
    public void setEntityContext(EntityContext ctx) {
    }

    public void unsetEntityContext() {
    }

    public void ejbActivate() {
    }

    public void ejbPassivate() {
    }

    public void ejbLoad() {
    }

    public void ejbStore() {
    }

    public void ejbRemove() {
    }
}