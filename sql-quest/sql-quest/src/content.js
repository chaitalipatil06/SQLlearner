// ===== SQL Quest course content =====
// All examples run on SQLite (in the browser). Differences from other databases are called out.
const ROLES = [
  { name: "Business Analyst", color: "#ffd6e0", icon: "chart",
    why: "Pull numbers yourself instead of waiting on the data team. Turn questions from leaders into queries.",
    chapters: [1,2,3,4,5,6,7,10] },
  { name: "Product Manager", color: "#d6ecff", icon: "rocket",
    why: "Check feature adoption, funnels and retention without a ticket. Talk confidently with engineers.",
    chapters: [1,2,3,5,6,8,9,10] },
  { name: "Operations / Project Manager", color: "#d9f7e6", icon: "gear",
    why: "Track throughput, backlogs, SLAs and team workload from the source data.",
    chapters: [1,2,3,4,5,6,7,10] },
  { name: "Data / BI Analyst", color: "#efe1ff", icon: "gem",
    why: "SQL is the core interview skill. Window functions and CTEs are what separate you from other candidates.",
    chapters: [1,2,3,4,5,6,7,8,9,10] }
];

const CHAPTERS = [
// ---------------------------------------------------------------- 1
{
  id: 1, title: "Welcome to Databases", sub: "Tables, rows, columns and keys", art: "table", color: "#ffd6e0",
  lumi: "Hi! I'm Lumi. A database is just a tidy collection of tables, like very strict spreadsheets. Let's peek inside!",
  roleTip: "In interviews for analyst and manager roles you'll often hear: \"Our data is in a warehouse, can you pull it?\" This chapter gives you the words to answer.",
  sections: [
    { h: "What is a database?", html: `
      <p>A <b>database</b> stores information so it can be searched quickly and safely by many people at once. Most companies use a <b>relational database</b>, which keeps data in <b>tables</b>.</p>
      <p><b>SQL</b> (say "sequel" or "S-Q-L") stands for <i>Structured Query Language</i>. It is the language you use to ask a database questions. Almost every company uses it: PostgreSQL, MySQL, SQL Server, Snowflake, BigQuery and SQLite all speak SQL with small accent differences.</p>
      <div class="callout">Think of it this way: <b>Excel</b> = you scroll and click. <b>SQL</b> = you describe the answer you want and the database finds it for you.</div>` },
    { h: "Tables, rows and columns", html: `
      <p>A <b>table</b> holds one kind of thing. Each <b>row</b> is one record (one employee, one order). Each <b>column</b> is one attribute (name, salary, date).</p>
      <p>Our practice company <b>Lumi Labs</b> has five tables:</p>
      <ul>
        <li><code>departments</code>: 6 teams like Sales and Finance</li>
        <li><code>employees</code>: 16 people, their department, manager, hire date and salary</li>
        <li><code>customers</code>: 14 client companies and their region</li>
        <li><code>products</code>: 6 things we sell</li>
        <li><code>orders</code>: 60 sales, each linking a customer, a sales rep (employee) and a product</li>
      </ul>
      <p>Open the <b>Schema</b> tab in the playground below at any time to see every column.</p>` },
    { h: "Keys: how tables connect", html: `
      <p>A <b>primary key (PK)</b> uniquely identifies each row. <code>employees.emp_id</code> is a primary key: no two employees share one, and it is never empty.</p>
      <p>A <b>foreign key (FK)</b> is a column that points to a primary key in another table. <code>orders.customer_id</code> points to <code>customers.customer_id</code>. That is how the database knows which customer placed each order.</p>
      <div class="callout tip">Keys are the reason you can later JOIN tables together (Chapter 6). Interviewers love asking "what's the difference between a primary key and a foreign key?"</div>` },
    { h: "Your very first query", html: `
      <p>Click <b>Try it</b> to run this. It shows every column (<code>*</code>) of the departments table.</p>
      <pre class="sql">SELECT * FROM departments;</pre>
      <p>Now try another table:</p>
      <pre class="sql">SELECT * FROM products;</pre>
      <p>The semicolon <code>;</code> ends a statement. SQL keywords are not case-sensitive, but writing them in CAPITALS makes queries easier to read.</p>` },
    { h: "Data types you'll meet", html: `
      <table class="mini"><tr><th>Type</th><th>Holds</th><th>Example</th></tr>
      <tr><td>INTEGER</td><td>Whole numbers</td><td>42</td></tr>
      <tr><td>DECIMAL / REAL</td><td>Numbers with decimals (use DECIMAL for money)</td><td>199.99</td></tr>
      <tr><td>TEXT / VARCHAR</td><td>Words</td><td>'Sales'</td></tr>
      <tr><td>DATE</td><td>Dates, written 'YYYY-MM-DD'</td><td>'2026-03-15'</td></tr>
      <tr><td>NULL</td><td>"Unknown / missing". It is not zero and not blank.</td><td>NULL</td></tr></table>
      <p>Text and dates go in <b>single quotes</b>: <code>'East'</code>. Numbers don't.</p>` }
  ],
  quiz: [
    { q: "In a table of employees, what is one row?", opts: ["One attribute, like salary","One employee","The whole table","A database"], a: 1, why: "Each row is one record: here, one employee." },
    { q: "orders.customer_id points to customers.customer_id. What is orders.customer_id?", opts: ["A primary key","A foreign key","A data type","A row"], a: 1, why: "A column that references another table's primary key is a foreign key." },
    { q: "What does NULL mean?", opts: ["Zero","An empty string ''","Unknown or missing","An error"], a: 2, why: "NULL means the value is unknown or missing. It is different from 0 or ''." }
  ],
  challenge: { prompt: "Show <b>all columns</b> of the <code>customers</code> table.", starter: "-- write your query here\n", solution: "SELECT * FROM customers;", ordered: false, hint: "SELECT * FROM table_name;" }
},
// ---------------------------------------------------------------- 2
{
  id: 2, title: "SELECT: Asking for Columns", sub: "SELECT, FROM, aliases, DISTINCT, math", art: "columns", color: "#d6ecff",
  lumi: "SELECT is your magic word. Tell the database WHICH columns you want and FROM which table.",
  roleTip: "Managers rarely need every column. Picking just the right columns makes reports readable and queries faster.",
  sections: [
    { h: "Choose your columns", html: `
      <p>List the columns you want after <code>SELECT</code>, separated by commas:</p>
      <pre class="sql">SELECT name, salary
FROM employees;</pre>
      <p>The order you list them is the order they appear. <code>SELECT *</code> is fine for exploring, but in real reports list the columns you need.</p>` },
    { h: "Rename with AS (aliases)", html: `
      <p>An <b>alias</b> gives a column a friendlier name in the result:</p>
      <pre class="sql">SELECT name AS employee, salary AS yearly_pay
FROM employees;</pre>
      <p>If an alias has spaces, wrap it in double quotes: <code>AS "Yearly Pay"</code>.</p>` },
    { h: "Do math in SELECT", html: `
      <p>You can calculate new columns on the fly. Monthly pay:</p>
      <pre class="sql">SELECT name, salary, salary / 12 AS monthly_pay
FROM employees;</pre>
      <p>Careful: in SQLite, PostgreSQL and SQL Server, dividing two whole numbers drops the decimals (<code>7 / 2 = 3</code>). Multiply by <code>1.0</code> to keep them:</p>
      <pre class="sql">SELECT name, ROUND(salary * 1.0 / 12, 2) AS monthly_pay
FROM employees;</pre>
      <p>Join text together with <code>||</code>:</p>
      <pre class="sql">SELECT product_name || ' (' || category || ')' AS label
FROM products;</pre>` },
    { h: "Unique values with DISTINCT", html: `
      <p>Which order statuses exist? <code>DISTINCT</code> removes duplicate rows:</p>
      <pre class="sql">SELECT DISTINCT status FROM orders;</pre>
      <pre class="sql">SELECT DISTINCT category FROM products;</pre>` },
    { h: "Comments and good style", html: `
      <p>Use <code>--</code> for a one-line comment. Put each clause on its own line. Your future self (and your reviewer) will thank you.</p>
      <pre class="sql">-- Product price list
SELECT product_name,
       price
FROM products;</pre>` }
  ],
  quiz: [
    { q: "Which query returns only the name and region of customers?", opts: ["SELECT * FROM customers;","SELECT name, region FROM customers;","SELECT customers FROM name, region;","GET name, region FROM customers;"], a: 1, why: "SELECT lists the columns, FROM names the table." },
    { q: "What does SELECT DISTINCT status FROM orders return?", opts: ["Every order","Each status value once","The number of statuses","Only completed orders"], a: 1, why: "DISTINCT removes duplicates, so each status shows once." },
    { q: "In SQLite, what is 7 / 2?", opts: ["3.5","3","4","Error"], a: 1, why: "Integer divided by integer drops the decimals. Use 7 * 1.0 / 2 to get 3.5." }
  ],
  challenge: { prompt: "Show each product's <code>product_name</code> and its price with 10% off, named <code>sale_price</code>.", starter: "SELECT ", solution: "SELECT product_name, price * 0.9 AS sale_price FROM products;", ordered: false, hint: "price * 0.9 AS sale_price" }
},
// ---------------------------------------------------------------- 3
{
  id: 3, title: "WHERE: Filtering Rows", sub: "Comparisons, AND/OR, IN, BETWEEN, LIKE, NULL", art: "funnel", color: "#d9f7e6",
  lumi: "WHERE is a filter. Only rows that pass the test make it into your answer. Like a coffee filter for data!",
  roleTip: "Almost every business question has a filter: \"last quarter\", \"in the West region\", \"completed orders only\". WHERE is how you say it.",
  sections: [
    { h: "Basic filters", html: `
      <pre class="sql">SELECT * FROM orders
WHERE status = 'completed';</pre>
      <table class="mini"><tr><th>Operator</th><th>Meaning</th></tr>
      <tr><td><code>=</code></td><td>equal</td></tr><tr><td><code>&lt;&gt;</code> or <code>!=</code></td><td>not equal</td></tr>
      <tr><td><code>&gt; &gt;= &lt; &lt;=</code></td><td>greater / less than</td></tr></table>
      <pre class="sql">SELECT name, salary FROM employees
WHERE salary >= 100000;</pre>` },
    { h: "Combine with AND / OR", html: `
      <pre class="sql">SELECT * FROM orders
WHERE status = 'completed' AND amount > 1000;</pre>
      <p><code>AND</code> is checked before <code>OR</code>. When you mix them, <b>always use parentheses</b>:</p>
      <pre class="sql">SELECT * FROM orders
WHERE (status = 'pending' OR status = 'cancelled')
  AND amount > 500;</pre>` },
    { h: "IN, BETWEEN and LIKE", html: `
      <p><code>IN</code> matches any value in a list:</p>
      <pre class="sql">SELECT name, region FROM customers
WHERE region IN ('East', 'West');</pre>
      <p><code>BETWEEN</code> is an inclusive range (dates are text 'YYYY-MM-DD', so they sort correctly):</p>
      <pre class="sql">SELECT order_id, order_date, amount FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-03-31';</pre>
      <p><code>LIKE</code> matches patterns. <code>%</code> = any characters, <code>_</code> = exactly one:</p>
      <pre class="sql">SELECT name FROM employees
WHERE name LIKE 'A%';   -- names starting with A</pre>` },
    { h: "The NULL trap", html: `
      <p>NULL means unknown, so <code>= NULL</code> is never true. Use <code>IS NULL</code> / <code>IS NOT NULL</code>:</p>
      <pre class="sql">SELECT name, hire_date FROM employees
WHERE hire_date IS NULL;</pre>
      <pre class="sql">-- Try this: it returns nothing!
SELECT * FROM customers WHERE region = NULL;</pre>
      <div class="callout warn">Also watch <code>WHERE region &lt;&gt; 'East'</code>: it silently skips customers whose region is NULL.</div>` }
  ],
  quiz: [
    { q: "Which returns customers with no region recorded?", opts: ["WHERE region = NULL","WHERE region IS NULL","WHERE region = ''","WHERE NOT region"], a: 1, why: "Only IS NULL tests for missing values." },
    { q: "What does WHERE name LIKE '%son' match?", opts: ["Names starting with son","Names ending with son","Names exactly 'son'","Names containing %son"], a: 1, why: "% before 'son' means anything can come first, so it matches names ending in son." },
    { q: "a OR b AND c is read as…", opts: ["(a OR b) AND c","a OR (b AND c)","Error","Random"], a: 1, why: "AND binds tighter than OR. Use parentheses to be explicit." }
  ],
  challenge: { prompt: "List <code>order_id</code> and <code>amount</code> of <b>completed</b> orders worth <b>more than 1000</b>.", starter: "SELECT order_id, amount\nFROM orders\nWHERE ", solution: "SELECT order_id, amount FROM orders WHERE status = 'completed' AND amount > 1000;", ordered: false, hint: "Two conditions joined with AND." }
},
// ---------------------------------------------------------------- 4
{
  id: 4, title: "ORDER BY & LIMIT", sub: "Sorting results and grabbing the top N", art: "sort", color: "#fff1c9",
  lumi: "Leaders love a leaderboard. ORDER BY sorts, LIMIT keeps just the top few. Easy wins!",
  roleTip: "\"Top 5 customers\", \"newest hires\", \"biggest deals this month\": the classic manager question is a sort plus a limit.",
  sections: [
    { h: "Sorting", html: `
      <pre class="sql">SELECT name, salary FROM employees
ORDER BY salary DESC;   -- highest first</pre>
      <p><code>ASC</code> (ascending, the default) goes small to big or A to Z. <code>DESC</code> goes big to small.</p>
      <p>Sort by several columns, applied left to right:</p>
      <pre class="sql">SELECT name, dept_id, salary FROM employees
ORDER BY dept_id ASC, salary DESC;</pre>` },
    { h: "Top N with LIMIT", html: `
      <pre class="sql">SELECT order_id, amount FROM orders
ORDER BY amount DESC
LIMIT 5;</pre>
      <p><code>LIMIT</code> without <code>ORDER BY</code> gives random-ish rows. Always sort first.</p>
      <p>Skip rows with <code>OFFSET</code> (useful for paging):</p>
      <pre class="sql">SELECT order_id, amount FROM orders
ORDER BY amount DESC
LIMIT 5 OFFSET 5;   -- ranks 6 to 10</pre>
      <div class="callout">Other databases: SQL Server uses <code>SELECT TOP 5</code>. Oracle and standard SQL use <code>FETCH FIRST 5 ROWS ONLY</code>.</div>` },
    { h: "Sort by an alias or calculation", html: `
      <pre class="sql">SELECT name, salary / 12 AS monthly
FROM employees
ORDER BY monthly DESC;</pre>
      <p>NULLs sort first in ascending order in SQLite and last in PostgreSQL. Use <code>NULLS LAST</code> where supported if it matters.</p>` }
  ],
  quiz: [
    { q: "How do you get the 3 newest hires?", opts: ["ORDER BY hire_date LIMIT 3","ORDER BY hire_date DESC LIMIT 3","LIMIT 3 ORDER BY hire_date","TOP hire_date 3"], a: 1, why: "Newest = latest date = DESC, then LIMIT 3." },
    { q: "What is the default sort direction?", opts: ["DESC","ASC","Random","By primary key"], a: 1, why: "ORDER BY defaults to ascending." },
    { q: "LIMIT 10 OFFSET 20 returns…", opts: ["Rows 1-10","Rows 21-30","Rows 20-30","Rows 10-20"], a: 1, why: "Skip 20 rows, then take 10: rows 21 through 30." }
  ],
  challenge: { prompt: "Show the <code>name</code> and <code>salary</code> of the <b>3 highest-paid</b> employees, highest first.", starter: "SELECT name, salary\nFROM employees\n", solution: "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;", ordered: true, hint: "ORDER BY salary DESC, then LIMIT 3." }
},
// ---------------------------------------------------------------- 5
{
  id: 5, title: "Summarize: GROUP BY", sub: "COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING", art: "groups", color: "#efe1ff",
  lumi: "Time to turn 60 rows into one clean summary. This is the chapter that makes dashboards happen!",
  roleTip: "Headcount per team, revenue per region, average deal size: this is 80% of management reporting. Master this chapter.",
  sections: [
    { h: "Aggregate functions", html: `
      <table class="mini"><tr><th>Function</th><th>Gives you</th></tr>
      <tr><td><code>COUNT(*)</code></td><td>number of rows</td></tr>
      <tr><td><code>COUNT(col)</code></td><td>number of non-NULL values</td></tr>
      <tr><td><code>COUNT(DISTINCT col)</code></td><td>number of unique values</td></tr>
      <tr><td><code>SUM(col)</code> / <code>AVG(col)</code></td><td>total / average</td></tr>
      <tr><td><code>MIN(col)</code> / <code>MAX(col)</code></td><td>smallest / largest</td></tr></table>
      <pre class="sql">SELECT COUNT(*) AS orders,
       SUM(amount) AS revenue,
       AVG(amount) AS avg_order,
       MAX(amount) AS biggest
FROM orders
WHERE status = 'completed';</pre>` },
    { h: "GROUP BY: one row per group", html: `
      <p>Add <code>GROUP BY</code> to get a summary <i>per</i> something:</p>
      <pre class="sql">SELECT status, COUNT(*) AS orders, SUM(amount) AS total
FROM orders
GROUP BY status;</pre>
      <pre class="sql">SELECT dept_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id
ORDER BY headcount DESC;</pre>
      <div class="callout tip"><b>Golden rule:</b> every column in SELECT must either be in GROUP BY or inside an aggregate like SUM().</div>` },
    { h: "HAVING: filter the groups", html: `
      <p><code>WHERE</code> filters <b>rows before</b> grouping. <code>HAVING</code> filters <b>groups after</b>:</p>
      <pre class="sql">SELECT customer_id, SUM(amount) AS spend
FROM orders
WHERE status = 'completed'     -- row filter
GROUP BY customer_id
HAVING SUM(amount) > 5000      -- group filter
ORDER BY spend DESC;</pre>` },
    { h: "The order SQL actually runs in", html: `
      <p>You write <code>SELECT</code> first, but the database runs it almost last:</p>
      <div class="order-strip"><span>FROM</span><span>WHERE</span><span>GROUP BY</span><span>HAVING</span><span>SELECT</span><span>ORDER BY</span><span>LIMIT</span></div>
      <p>That's why you can't use a SELECT alias inside WHERE (it doesn't exist yet) but you <i>can</i> use it in ORDER BY.</p>` }
  ],
  quiz: [
    { q: "Which filters groups after aggregation?", opts: ["WHERE","HAVING","ORDER BY","LIMIT"], a: 1, why: "HAVING runs after GROUP BY, so it can test SUM(), COUNT() and friends." },
    { q: "COUNT(hire_date) on employees where one hire_date is NULL gives…", opts: ["16","15","NULL","Error"], a: 1, why: "COUNT(col) skips NULLs. COUNT(*) would give 16." },
    { q: "SELECT dept_id, name, COUNT(*) FROM employees GROUP BY dept_id is…", opts: ["Perfect","Breaks the golden rule: name isn't grouped or aggregated","Faster","The same as COUNT(*)"], a: 1, why: "name is neither in GROUP BY nor aggregated. Strict databases reject it." }
  ],
  challenge: { prompt: "For each <code>region</code> in <code>customers</code>, count the customers as <code>num_customers</code>.", starter: "SELECT region, \nFROM customers\n", solution: "SELECT region, COUNT(*) AS num_customers FROM customers GROUP BY region;", ordered: false, hint: "COUNT(*) ... GROUP BY region" }
},
// ---------------------------------------------------------------- 6
{
  id: 6, title: "JOINs: Connecting Tables", sub: "INNER, LEFT, self joins and anti-joins", art: "venn", color: "#ffe0cc",
  lumi: "Tables are friends who hold hands through keys. JOIN brings them together into one result!",
  roleTip: "Real questions span tables: \"revenue by department\" needs orders + employees + departments. JOINs are the #1 SQL interview topic.",
  sections: [
    { h: "INNER JOIN: matching rows only", html: `
      <pre class="sql">SELECT o.order_id, c.name AS customer, o.amount
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id;</pre>
      <p><code>o</code> and <code>c</code> are <b>table aliases</b>, a nickname so you can write <code>o.amount</code> instead of <code>orders.amount</code>. <code>JOIN</code> means <code>INNER JOIN</code>.</p>
      <p><code>ON</code> says how rows match: usually foreign key = primary key.</p>` },
    { h: "LEFT JOIN: keep everything on the left", html: `
      <p>Which customers have <i>never</i> ordered? An inner join would hide them. A <code>LEFT JOIN</code> keeps every customer and fills NULL where there's no order:</p>
      <pre class="sql">SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
ORDER BY o.order_id;</pre>
      <p>Keep only the non-matches. This is called an <b>anti-join</b>:</p>
      <pre class="sql">SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;</pre>` },
    { h: "Join + GROUP BY = real reports", html: `
      <pre class="sql">SELECT d.dept_name, COUNT(*) AS headcount, ROUND(AVG(e.salary)) AS avg_salary
FROM employees e
JOIN departments d ON d.dept_id = e.dept_id
GROUP BY d.dept_name
ORDER BY headcount DESC;</pre>
      <p>Three tables at once: revenue by product category.</p>
      <pre class="sql">SELECT p.category, SUM(o.amount) AS revenue
FROM orders o
JOIN products p ON p.product_id = o.product_id
WHERE o.status = 'completed'
GROUP BY p.category;</pre>` },
    { h: "Self join: the org chart", html: `
      <p>A table can join to itself. Each employee's manager is also an employee:</p>
      <pre class="sql">SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.emp_id = e.manager_id;</pre>` },
    { h: "Join gotchas", html: `
      <ul>
        <li><b>Row explosion:</b> joining one-to-many repeats the "one" side. Check row counts before and after.</li>
        <li><b>LEFT JOIN + WHERE on the right table</b> turns it back into an inner join. Put that condition in <code>ON</code> instead.</li>
        <li><code>RIGHT JOIN</code> is a mirrored LEFT JOIN, and <code>FULL OUTER JOIN</code> keeps both sides. Both are less common.</li>
      </ul>` }
  ],
  quiz: [
    { q: "You need all customers, including those with zero orders. Use…", opts: ["customers INNER JOIN orders","customers LEFT JOIN orders","orders LEFT JOIN customers","CROSS JOIN"], a: 1, why: "LEFT JOIN keeps every row of the left table, customers." },
    { q: "What does the ON clause do?", opts: ["Sorts rows","Defines how rows from the two tables match","Filters groups","Renames tables"], a: 1, why: "ON gives the matching condition, usually FK = PK." },
    { q: "Customers with no orders: LEFT JOIN orders then…", opts: ["WHERE o.order_id IS NULL","WHERE o.order_id = 0","HAVING COUNT(*) = 0","ORDER BY NULL"], a: 0, why: "Unmatched rows have NULL in every orders column." }
  ],
  challenge: { prompt: "Show each <b>department name</b> and its <b>total salary</b> as <code>payroll</code>. Only include employees who have a department.", starter: "SELECT d.dept_name, \nFROM employees e\nJOIN departments d ON \n", solution: "SELECT d.dept_name, SUM(e.salary) AS payroll FROM employees e JOIN departments d ON d.dept_id = e.dept_id GROUP BY d.dept_name;", ordered: false, hint: "JOIN on dept_id, then SUM(e.salary) ... GROUP BY d.dept_name" }
},
// ---------------------------------------------------------------- 7
{
  id: 7, title: "CASE & Handy Functions", sub: "If-then logic, NULL fixes, text and dates", art: "switch", color: "#d6f5f5",
  lumi: "CASE lets your query make decisions, like labelling deals Small, Medium or Large. Very manager-y!",
  roleTip: "Business rules like \"tier customers\", \"flag late orders\" or \"bucket deal sizes\" are CASE statements.",
  sections: [
    { h: "CASE WHEN: if-then-else", html: `
      <pre class="sql">SELECT order_id, amount,
       CASE
         WHEN amount >= 2000 THEN 'Large'
         WHEN amount >= 500  THEN 'Medium'
         ELSE 'Small'
       END AS deal_size
FROM orders;</pre>
      <p>Conditions are checked top to bottom. The first true one wins.</p>` },
    { h: "Count by condition (pivot trick)", html: `
      <pre class="sql">SELECT emp_id,
       COUNT(*) AS total,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM orders
GROUP BY emp_id;</pre>
      <p>This "conditional aggregation" builds a mini pivot table in one query.</p>` },
    { h: "Fixing NULLs: COALESCE and NULLIF", html: `
      <pre class="sql">SELECT name, COALESCE(region, 'Unknown') AS region
FROM customers;</pre>
      <p><code>COALESCE(a, b)</code> returns the first value that isn't NULL. <code>NULLIF(x, 0)</code> turns 0 into NULL, which prevents divide-by-zero errors: <code>revenue / NULLIF(orders, 0)</code>.</p>` },
    { h: "Text and date functions", html: `
      <pre class="sql">SELECT UPPER(name), LENGTH(name), SUBSTR(name, 1, 3)
FROM customers;</pre>
      <p>Dates in SQLite use <code>strftime</code>:</p>
      <pre class="sql">SELECT strftime('%Y-%m', order_date) AS month,
       SUM(amount) AS revenue
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month;</pre>
      <table class="mini"><tr><th>Task</th><th>SQLite</th><th>PostgreSQL</th><th>SQL Server</th></tr>
      <tr><td>Month</td><td><code>strftime('%Y-%m', d)</code></td><td><code>DATE_TRUNC('month', d)</code></td><td><code>FORMAT(d,'yyyy-MM')</code></td></tr>
      <tr><td>Year</td><td><code>strftime('%Y', d)</code></td><td><code>EXTRACT(YEAR FROM d)</code></td><td><code>YEAR(d)</code></td></tr>
      <tr><td>Today</td><td><code>date('now')</code></td><td><code>CURRENT_DATE</code></td><td><code>GETDATE()</code></td></tr></table>` }
  ],
  quiz: [
    { q: "COALESCE(NULL, NULL, 'x', 'y') returns…", opts: ["NULL","'x'","'y'","Error"], a: 1, why: "It returns the first non-NULL argument." },
    { q: "Amount 2500 with WHEN amount >= 500 THEN 'Medium' listed BEFORE WHEN amount >= 2000 THEN 'Large' gives…", opts: ["Large","Medium","Both","NULL"], a: 1, why: "CASE stops at the first true condition. Put the most specific one first." },
    { q: "Why use NULLIF(orders, 0) in a division?", opts: ["To round","To avoid divide-by-zero","To sort","To count NULLs"], a: 1, why: "Dividing by NULL returns NULL instead of an error." }
  ],
  challenge: { prompt: "Show <code>name</code> and <code>salary</code> of every employee plus a column <code>band</code>: <b>'Senior'</b> if salary ≥ 120000, otherwise <b>'Core'</b>.", starter: "SELECT name, salary,\n       CASE \n       END AS band\nFROM employees;", solution: "SELECT name, salary, CASE WHEN salary >= 120000 THEN 'Senior' ELSE 'Core' END AS band FROM employees;", ordered: false, hint: "CASE WHEN salary >= 120000 THEN 'Senior' ELSE 'Core' END" }
},
// ---------------------------------------------------------------- 8
{
  id: 8, title: "Subqueries & CTEs", sub: "Queries inside queries, and WITH for readable steps", art: "nest", color: "#ffe6f2",
  lumi: "Big questions are easier in small steps. A CTE lets you name each step, like chapters in a story!",
  roleTip: "Analyst take-home tests are full of multi-step logic. CTEs make your answers readable, and interviewers notice.",
  sections: [
    { h: "Subquery in WHERE", html: `
      <p>Who earns more than the company average?</p>
      <pre class="sql">SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);</pre>
      <p>The inner query runs first and returns one number.</p>
      <pre class="sql">-- Customers who bought the Enterprise Plan
SELECT name FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE product_id = 3);</pre>` },
    { h: "CTEs with WITH", html: `
      <p>A <b>Common Table Expression</b> names a temporary result you can use like a table:</p>
      <pre class="sql">WITH customer_spend AS (
  SELECT customer_id, SUM(amount) AS spend
  FROM orders
  WHERE status = 'completed'
  GROUP BY customer_id
)
SELECT c.name, s.spend
FROM customer_spend s
JOIN customers c ON c.customer_id = s.customer_id
ORDER BY s.spend DESC;</pre>
      <p>You can chain several: <code>WITH a AS (...), b AS (...) SELECT ...</code>. Read them top to bottom like steps in a recipe.</p>` },
    { h: "EXISTS", html: `
      <pre class="sql">SELECT d.dept_name
FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id AND e.salary > 120000);</pre>
      <p><code>EXISTS</code> is true if the inner query finds at least one row. <code>NOT EXISTS</code> is a clean anti-join.</p>` }
  ],
  quiz: [
    { q: "What does WITH x AS (...) create?", opts: ["A permanent table","A named temporary result for this query","An index","A view saved forever"], a: 1, why: "A CTE lives only for the query it's in." },
    { q: "Best reason to prefer CTEs over deeply nested subqueries?", opts: ["Always faster","Readability: logic reads top to bottom","They change data","They avoid joins"], a: 1, why: "CTEs mainly make complex logic easy to follow and debug." },
    { q: "WHERE salary > (SELECT AVG(salary) FROM employees): the subquery returns…", opts: ["A table","One single value","Nothing","Every salary"], a: 1, why: "It's a scalar subquery: one row, one column." }
  ],
  challenge: { prompt: "List the <code>name</code> of employees who earn <b>more than the average salary</b>.", starter: "SELECT name\nFROM employees\nWHERE ", solution: "SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);", ordered: false, hint: "Compare salary to (SELECT AVG(salary) FROM employees)" }
},
// ---------------------------------------------------------------- 9
{
  id: 9, title: "Window Functions", sub: "Ranks, running totals and LAG, without losing rows", art: "window", color: "#e6f0ff",
  lumi: "Window functions are a superpower. You keep every row AND add a rank or running total next to it. Ooh!",
  roleTip: "\"Top 3 per team\", \"month-over-month growth\", \"running total\". These are window functions, and they're the intermediate-level interview favorite.",
  sections: [
    { h: "The idea", html: `
      <p><code>GROUP BY</code> squashes rows into one per group. A <b>window function</b> computes across related rows but keeps every row:</p>
      <pre class="sql">SELECT name, dept_id, salary,
       AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg
FROM employees;</pre>
      <p><code>OVER (...)</code> makes it a window function. <code>PARTITION BY</code> says "restart for each group".</p>` },
    { h: "Ranking", html: `
      <pre class="sql">SELECT name, dept_id, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees;</pre>
      <p>With ties 100, 100, 90: ROW_NUMBER gives 1, 2, 3. RANK gives 1, 1, 3. DENSE_RANK gives 1, 1, 2.</p>
      <p><b>Top earner per department</b> (a classic!):</p>
      <pre class="sql">WITH ranked AS (
  SELECT name, dept_id, salary,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT * FROM ranked WHERE rn = 1;</pre>` },
    { h: "Running totals", html: `
      <pre class="sql">SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders
WHERE status = 'completed';</pre>` },
    { h: "LAG and LEAD: compare to the previous row", html: `
      <pre class="sql">WITH monthly AS (
  SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS revenue
  FROM orders WHERE status = 'completed'
  GROUP BY month
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_month,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM monthly;</pre>
      <p><code>LAG</code> looks back one row, and <code>LEAD</code> looks forward. Month-over-month growth in one query!</p>` }
  ],
  quiz: [
    { q: "Ties 100, 100, 90 with DENSE_RANK give…", opts: ["1,2,3","1,1,3","1,1,2","2,2,1"], a: 2, why: "DENSE_RANK shares ranks on ties and leaves no gap." },
    { q: "What does PARTITION BY dept_id do?", opts: ["Deletes departments","Restarts the calculation for each department","Sorts the output","Groups and collapses rows"], a: 1, why: "It splits rows into separate windows without collapsing them." },
    { q: "Which function gets the previous month's revenue on the same row?", opts: ["LEAD","LAG","FIRST","PREV"], a: 1, why: "LAG looks at the prior row in the window's order." }
  ],
  challenge: { prompt: "Show <code>name</code>, <code>salary</code> and <code>salary_rank</code>: each employee's rank by salary, highest = 1, using <b>RANK()</b>.", starter: "SELECT name, salary,\n       RANK() OVER () AS salary_rank\nFROM employees;", solution: "SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS salary_rank FROM employees;", ordered: false, hint: "RANK() OVER (ORDER BY salary DESC)" }
},
// ---------------------------------------------------------------- 10
{
  id: 10, title: "Boss Level: Real Reports", sub: "KPIs, cohorts, top-N, and interview prep", art: "trophy", color: "#fff0d6",
  lumi: "Final chapter! Let's combine everything into the reports a real manager would ask for. You've got this!",
  roleTip: "These are the exact queries hiring managers ask about in case interviews. Practice explaining each one out loud.",
  sections: [
    { h: "Monthly KPI dashboard query", html: `
      <pre class="sql">SELECT strftime('%Y-%m', order_date)        AS month,
       COUNT(*)                              AS orders,
       COUNT(DISTINCT customer_id)           AS active_customers,
       SUM(amount)                           AS revenue,
       ROUND(AVG(amount), 0)                 AS avg_order_value
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month;</pre>` },
    { h: "Sales rep leaderboard with share of total", html: `
      <pre class="sql">SELECT e.name,
       SUM(o.amount) AS sales,
       ROUND(100.0 * SUM(o.amount) / SUM(SUM(o.amount)) OVER (), 1) AS pct_of_total
FROM orders o
JOIN employees e ON e.emp_id = o.emp_id
WHERE o.status = 'completed'
GROUP BY e.name
ORDER BY sales DESC;</pre>` },
    { h: "Cancellation rate per product", html: `
      <pre class="sql">SELECT p.product_name,
       COUNT(*) AS orders,
       ROUND(100.0 * SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 1) AS cancel_pct
FROM orders o
JOIN products p ON p.product_id = o.product_id
GROUP BY p.product_name
ORDER BY cancel_pct DESC;</pre>` },
    { h: "Year-over-year growth", html: `
      <pre class="sql">WITH yearly AS (
  SELECT strftime('%Y', order_date) AS yr, SUM(amount) AS revenue
  FROM orders WHERE status = 'completed'
  GROUP BY yr
)
SELECT yr, revenue,
       LAG(revenue) OVER (ORDER BY yr) AS last_year,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY yr)) / LAG(revenue) OVER (ORDER BY yr), 1) AS growth_pct
FROM yearly;</pre>
      <div class="callout">2026 only has data through October here, so the growth number is year-to-date. Pointing this out in an interview shows good judgment!</div>` },
    { h: "Interview checklist", html: `
      <ul class="checklist">
        <li>Second-highest salary (<code>DENSE_RANK</code> or a subquery)</li>
        <li>Find duplicates (<code>GROUP BY ... HAVING COUNT(*) &gt; 1</code>)</li>
        <li>Customers with no orders (anti-join)</li>
        <li>Employees earning more than their manager (self join)</li>
        <li>Top N per group (<code>ROW_NUMBER</code> + <code>PARTITION BY</code>)</li>
        <li>Month-over-month change (<code>LAG</code>)</li>
        <li>Explain: WHERE vs HAVING, INNER vs LEFT JOIN, UNION vs UNION ALL, DELETE vs TRUNCATE</li>
      </ul>
      <p>Bonus to try: employees who earn more than their manager.</p>
      <pre class="sql">SELECT e.name, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.emp_id = e.manager_id
WHERE e.salary > m.salary;</pre>` }
  ],
  quiz: [
    { q: "Best way to find duplicate customer names?", opts: ["SELECT DISTINCT name","GROUP BY name HAVING COUNT(*) > 1","ORDER BY name","WHERE name = name"], a: 1, why: "Group by the value and keep groups with more than one row." },
    { q: "SUM(SUM(amount)) OVER () in a grouped query gives…", opts: ["An error always","The grand total across all groups","The running total","Each row's amount"], a: 1, why: "The inner SUM is per group; the window SUM over () adds all groups together." },
    { q: "A YoY number where this year only has 10 months is…", opts: ["Perfectly comparable","Year-to-date, so it should be flagged or compared to the same months","Always negative","Invalid SQL"], a: 1, why: "Compare like with like: same months, or call it out clearly." }
  ],
  challenge: { prompt: "Final boss! For each <b>region</b>, show total <b>completed</b> revenue as <code>revenue</code>, highest first. (Hint: orders don't have a region, so join customers.)", starter: "SELECT c.region, \nFROM orders o\nJOIN customers c ON \nWHERE \nGROUP BY \nORDER BY ", solution: "SELECT c.region, SUM(o.amount) AS revenue FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.status = 'completed' GROUP BY c.region ORDER BY revenue DESC;", ordered: true, hint: "JOIN on customer_id, WHERE status = 'completed', GROUP BY c.region, ORDER BY revenue DESC" }
}
];

// ===== Reward games (one unlocks after every 2 chapters) =====
const GAMES = [
  { id: 1, after: 2, title: "Keyword Memory", kind: "memory", desc: "Flip cards to match each SQL keyword with what it does. Fewest flips wins!",
    pairs: [["SELECT","pick columns"],["FROM","choose table"],["WHERE","filter rows"],["DISTINCT","remove duplicates"],["AS","rename"],["*","all columns"],["NULL","unknown value"],["PK","unique row id"]] },
  { id: 2, after: 4, title: "Clause Shuffle", kind: "order", desc: "The clauses fell out of order! Tap them in the correct order to rebuild each query.",
    rounds: [
      ["SELECT name", "FROM employees", "WHERE salary > 90000", "ORDER BY salary DESC", "LIMIT 5"],
      ["SELECT status, COUNT(*)", "FROM orders", "GROUP BY status", "HAVING COUNT(*) > 5", "ORDER BY 2 DESC"],
      ["SELECT c.name, o.amount", "FROM orders o", "JOIN customers c ON c.customer_id = o.customer_id", "WHERE o.amount > 1000", "ORDER BY o.amount DESC"]
    ] },
  { id: 3, after: 6, title: "Join Detective", kind: "join", desc: "Look at the two tiny tables and predict how many rows each join returns.",
    left: { name: "pets", cols: ["pet","owner_id"], rows: [["Mochi",1],["Pip",2],["Bun",2],["Taro",4]] },
    right: { name: "owners", cols: ["owner_id","owner"], rows: [[1,"Ana"],[2,"Ben"],[3,"Cy"]] },
    rounds: [
      { q: "pets INNER JOIN owners ON owner_id", a: 3, why: "Mochi→Ana, Pip→Ben, Bun→Ben. Taro's owner 4 doesn't exist." },
      { q: "pets LEFT JOIN owners", a: 4, why: "All 4 pets stay; Taro gets NULL owner." },
      { q: "owners LEFT JOIN pets", a: 4, why: "Ana(1) + Ben(2 pets) + Cy with NULL = 4 rows." },
      { q: "pets CROSS JOIN owners", a: 12, why: "Every combination: 4 × 3 = 12." },
      { q: "Owners with no pets (anti-join)", a: 1, why: "Only Cy." }
    ] },
  { id: 4, after: 8, title: "Brain Teasers", kind: "teaser", desc: "Classic puzzles to stretch your logic muscles. Think slow; the obvious answer is often a trap!",
    rounds: [
      { q: "A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How many cents does the ball cost?", a: "5", why: "Ball = 5¢, bat = $1.05. The tempting answer 10¢ makes the bat only 90¢ more." },
      { q: "5 machines make 5 widgets in 5 minutes. How many minutes do 100 machines need to make 100 widgets?", a: "5", why: "Each machine makes 1 widget in 5 minutes, no matter how many machines there are." },
      { q: "A lily patch doubles in size every day. It covers the lake on day 48. On which day did it cover half the lake?", a: "47", why: "It doubles from half to full in one day." },
      { q: "A drawer has red and blue socks, all mixed up, and the room is dark. How many socks must you pull out to be sure you have a matching pair?", a: "3", why: "With only 2 colors, 3 socks guarantees two of them match." },
      { q: "Table A has 6 rows, table B has 5. What's the MOST rows an INNER JOIN could return?", a: "30", why: "If every row matches every row (same key everywhere), it behaves like a cross join: 6 × 5." },
      { q: "What comes next: 2, 3, 5, 7, 11, 13, ?", a: "17", why: "They're prime numbers." }
    ] },
  { id: 5, after: 10, title: "Speed Blitz", kind: "blitz", desc: "60 seconds. True or false? Answer as many as you can. Then claim your certificate!",
    items: [
      ["HAVING filters groups after aggregation.", true], ["WHERE x = NULL finds missing values.", false], ["LEFT JOIN keeps all rows from the left table.", true],
      ["COUNT(*) skips NULLs.", false], ["DISTINCT removes duplicate rows.", true], ["SELECT runs before WHERE.", false],
      ["DENSE_RANK leaves gaps after ties.", false], ["A primary key can be NULL.", false], ["UNION ALL keeps duplicates.", true],
      ["CTEs start with the keyword WITH.", true], ["ORDER BY can use a SELECT alias.", true], ["LIMIT without ORDER BY guarantees the top rows.", false],
      ["LAG looks at the previous row.", true], ["A foreign key points to another table's primary key.", true], ["AND is evaluated before OR.", true],
      ["7 / 2 = 3.5 in SQLite.", false], ["COALESCE returns the first non-NULL value.", true], ["CROSS JOIN of 3 and 4 rows gives 7 rows.", false],
      ["PARTITION BY collapses rows like GROUP BY.", false], ["BETWEEN is inclusive of both ends.", true]
    ] }
];
