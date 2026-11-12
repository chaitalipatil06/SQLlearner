import random, json
random.seed(7)
deps=[(1,'Sales','New York'),(2,'Marketing','Austin'),(3,'Operations','Chicago'),(4,'Finance','New York'),(5,'Product','San Francisco'),(6,'HR','Remote')]
emps=[(1,'Maya Patel',None,None,'2016-03-01',185000),
(2,'Leo Garcia',1,1,'2018-06-15',140000),(3,'Aisha Khan',1,2,'2020-01-10',82000),(4,'Ben Carter',1,2,'2021-04-05',76000),(5,'Chloe Wu',1,2,'2022-09-19',71000),
(6,'Ravi Iyer',2,1,'2019-02-11',125000),(7,'Sofia Rossi',2,6,'2021-07-01',68000),(8,'Tom Becker',2,6,None,64000),
(9,'Nora Silva',3,1,'2017-11-20',130000),(10,'Omar Haddad',3,9,'2020-05-25',72000),(11,'Grace Lee',3,9,'2023-02-14',61000),
(12,'Daniel Kim',4,1,'2018-08-08',135000),(13,'Emma Novak',4,12,'2022-03-30',79000),
(14,'Priya Shah',5,1,'2019-10-01',150000),(15,'Jack Murphy',5,14,'2021-12-06',118000),(16,'Lina Costa',6,1,'2020-08-17',98000)]
# fix dept for Maya: Product? keep NULL dept as CEO? set dept 6? leave NULL to teach NULLs
regions=['East','West','North','South']
custs=[]
names=['Acme Corp','Blue Harbor','Cedar Labs','Delta Foods','Evergreen Inc','Fable Studio','Granite Bank','Helio Energy','Iris Health','Juniper Retail','Kite Logistics','Lotus Travel','Maple Schools','Nimbus Cloud']
for i,n in enumerate(names,1):
    custs.append((i,n,regions[i%4] if i!=13 else None,f'2025-{(i%12)+1:02d}-{(i*3)%27+1:02d}'))
prods=[(1,'Starter Plan','Software',49),(2,'Pro Plan','Software',199),(3,'Enterprise Plan','Software',999),(4,'Onboarding Workshop','Services',1500),(5,'Data Audit','Services',3200),(6,'Support Add-on','Software',99)]
orders=[]
oid=1
reps=[3,4,5,2]
for m in range(1,13):
    yr=2025 if m<=12 else 2026
for k in range(60):
    c=random.randint(1,12)  # 13,14 never order
    p=random.choice([1,2,2,3,4,5,6,6])
    q=random.randint(1,5) if p in (1,2,6) else 1
    amt=prods[p-1][3]*q
    y=random.choice([2025,2025,2026])
    mo=random.randint(1,12) if y==2025 else random.randint(1,10)
    d=f'{y}-{mo:02d}-{random.randint(1,28):02d}'
    st=random.choices(['completed','cancelled','pending'],[78,12,10])[0]
    orders.append((oid,c,random.choice(reps),p,d,q,amt,st)); oid+=1
orders.sort(key=lambda o:o[4])
orders=[(i+1,)+o[1:] for i,o in enumerate(orders)]
def v(x): return 'NULL' if x is None else (str(x) if isinstance(x,(int,float)) else "'"+x.replace("'","''")+"'")
out=["CREATE TABLE departments (dept_id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL, location TEXT);",
"CREATE TABLE employees (emp_id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER REFERENCES departments(dept_id), manager_id INTEGER REFERENCES employees(emp_id), hire_date TEXT, salary INTEGER);",
"CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT, region TEXT, signup_date TEXT);",
"CREATE TABLE products (product_id INTEGER PRIMARY KEY, product_name TEXT, category TEXT, price INTEGER);",
"CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(customer_id), emp_id INTEGER REFERENCES employees(emp_id), product_id INTEGER REFERENCES products(product_id), order_date TEXT, quantity INTEGER, amount INTEGER, status TEXT);"]
for t,rows in [('departments',deps),('employees',emps),('customers',custs),('products',prods),('orders',orders)]:
    out.append(f"INSERT INTO {t} VALUES "+",".join("("+",".join(v(x) for x in r)+")" for r in rows)+";")
open('seed.sql','w').write("\n".join(out))
print(len(orders))
