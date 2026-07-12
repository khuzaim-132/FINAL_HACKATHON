import { neon } from "@neondatabase/serverless";

function createMockDb() {
  const now = new Date();
  const uuid = () => crypto.randomUUID();
  const daysAgo = (d) => new Date(now.getTime() - d * 86400000);
  const assetCode = () => {
    const p = "AST";
    const t = Date.now().toString(36).toUpperCase().slice(-4);
    const r = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${p}-${t}-${r}`;
  };

  const codes = [assetCode(), assetCode(), assetCode(), assetCode(), assetCode(), assetCode(), assetCode(), assetCode()];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const store = {
    users: [
      { id: uuid(), name: "Admin User", email: "admin@example.com", password_hash: "$2a$12$dummy", role: "admin", created_at: daysAgo(30) },
      { id: uuid(), name: "Alice Technician", email: "alice@example.com", password_hash: "$2a$12$dummy", role: "technician", created_at: daysAgo(25) },
      { id: uuid(), name: "Bob Technician", email: "bob@example.com", password_hash: "$2a$12$dummy", role: "technician", created_at: daysAgo(20) },
    ],
    assets: [
      { id: uuid(), asset_code: codes[0], name: "CNC Milling Machine", description: "Industrial CNC milling machine for metal fabrication", category: "Manufacturing", location: "Building A, Floor 1", status: "operational", qr_code_url: `${baseUrl}/assets/${codes[0]}`, created_at: daysAgo(90), updated_at: daysAgo(5), next_service_date: daysAgo(30).toISOString().split("T")[0] },
      { id: uuid(), asset_code: codes[1], name: "HVAC System Unit 3", description: "Central HVAC system for the office building", category: "Electrical", location: "Building A, Roof", status: "operational", qr_code_url: `${baseUrl}/assets/${codes[1]}`, created_at: daysAgo(60), updated_at: daysAgo(10), next_service_date: daysAgo(45).toISOString().split("T")[0] },
      { id: uuid(), asset_code: codes[2], name: "Server Rack #7", description: "Main production server rack", category: "IT", location: "Data Center, Row C", status: "issue_reported", qr_code_url: `${baseUrl}/assets/${codes[2]}`, created_at: daysAgo(45), updated_at: daysAgo(2), next_service_date: null },
      { id: uuid(), asset_code: codes[3], name: "Forklift Model X2", description: "Electric forklift for warehouse operations", category: "Logistics", location: "Warehouse", status: "under_maintenance", qr_code_url: `${baseUrl}/assets/${codes[3]}`, created_at: daysAgo(30), updated_at: daysAgo(1), next_service_date: daysAgo(15).toISOString().split("T")[0] },
      { id: uuid(), asset_code: codes[4], name: "Water Pump Station", description: "Main water pumping station for facility", category: "Plumbing", location: "Basement, Room B2", status: "operational", qr_code_url: `${baseUrl}/assets/${codes[4]}`, created_at: daysAgo(20), updated_at: daysAgo(3), next_service_date: daysAgo(60).toISOString().split("T")[0] },
      { id: uuid(), asset_code: codes[5], name: "Solar Panel Array", description: "Rooftop solar panel array 50kW", category: "Electrical", location: "Building B, Roof", status: "under_inspection", qr_code_url: `${baseUrl}/assets/${codes[5]}`, created_at: daysAgo(15), updated_at: daysAgo(0), next_service_date: null },
      { id: uuid(), asset_code: codes[6], name: "Fire Alarm System", description: "Building-wide fire alarm and sprinkler system", category: "Safety", location: "Building A, All Floors", status: "operational", qr_code_url: `${baseUrl}/assets/${codes[6]}`, created_at: daysAgo(10), updated_at: daysAgo(7), next_service_date: daysAgo(90).toISOString().split("T")[0] },
      { id: uuid(), asset_code: codes[7], name: "Elevator Bank A", description: "Passenger elevators serving floors 1-10", category: "Mechanical", location: "Building A, Core", status: "operational", qr_code_url: `${baseUrl}/assets/${codes[7]}`, created_at: daysAgo(5), updated_at: daysAgo(1), next_service_date: daysAgo(14).toISOString().split("T")[0] },
    ],
    issues: [],
    maintenance_records: [],
    maintenance_history: [],
    alerts: [],
  };

  const assetIds = store.assets.map((a) => ({ id: a.id, name: a.name, code: a.asset_code, location: a.location }));
  const techIds = store.users.filter((u) => u.role === "technician").map((u) => ({ id: u.id, name: u.name }));

  const issueTemplates = [
    { title: "Unusual vibration during operation", desc: "CNC milling machine producing excessive vibration above 3000 RPM", category: "Mechanical", priority: "high", causes: ["Worn spindle bearings", "Unbalanced chuck", "Loose mounting bolts"], checks: ["Check spindle runout", "Inspect bearing temperature", "Verify floor anchoring"] },
    { title: "Intermittent power fluctuation", desc: "HVAC unit 3 experiencing random power cycling every 2-3 hours", category: "Electrical", priority: "critical", causes: ["Faulty capacitor bank", "Loose electrical connection", "Control board failure"], checks: ["Measure voltage at terminals", "Inspect capacitor bank", "Check control board for error codes"] },
    { title: "Cooling fan failure", desc: "Server rack #7 rear cooling fans not spinning, temperature rising to 85C", category: "IT", priority: "critical", causes: ["Fan motor burnt out", "Power supply to fans failed", "Controller board fault"], checks: ["Verify fan power supply", "Check fan controller", "Measure temperature gradient"] },
    { title: "Hydraulic fluid leak", desc: "Forklift X2 leaking hydraulic fluid from the lift cylinder area", category: "Logistics", priority: "high", causes: ["Damaged hydraulic seal", "Cracked hydraulic line", "Loose fitting"], checks: ["Identify leak source", "Check fluid level and type", "Inspect hose condition"] },
    { title: "Strange noise from pump motor", desc: "Water pump station making intermittent grinding noise during operation", category: "Plumbing", priority: "medium", causes: ["Worn pump bearings", "Cavitation due to low inlet pressure", "Debris in impeller"], checks: ["Listen for bearing noise", "Check inlet pressure", "Inspect impeller for debris"] },
    { title: "Reduced power output", desc: "Solar panel array producing 30% less than expected output this quarter", category: "Electrical", priority: "medium", causes: ["Panel soiling/debris", "Inverter efficiency loss", "Partial shading from new structure"], checks: ["Clean panels and retest", "Check inverter logs", "Survey for new obstructions"] },
    { title: "Fire alarm false trigger", desc: "Zone 4 fire alarm triggering randomly, no smoke or fire detected", category: "Safety", priority: "high", causes: ["Faulty smoke detector", "Wiring short circuit", "Dust contamination in sensor"], checks: ["Test individual detectors", "Inspect wiring for damage", "Clean sensor chambers"] },
    { title: "Elevator door jam", desc: "Elevator 2 doors failing to close properly, causing intermittent service disruption", category: "Mechanical", priority: "high", causes: ["Misaligned door tracks", "Obstruction in door channel", "Worn door rollers"], checks: ["Inspect door track alignment", "Check for debris", "Test door roller resistance"] },
  ];

  issueTemplates.forEach((t, i) => {
    const asset = assetIds[i % assetIds.length];
    const tech = techIds[i % techIds.length];
    const statuses = ["reported", "assigned", "under_inspection", "under_maintenance", "resolved"];
    const status = statuses[i % statuses.length];
    const issueId = uuid();

    const aiSuggestion = {
      professional_title: t.title,
      possible_causes: t.causes,
      diagnostic_checks: t.checks,
    };

    store.issues.push({
      id: issueId,
      asset_id: asset.id,
      reported_by_name: ["Mike R.", "Sarah L.", "John D.", "Emma W.", "Carlos G.", "Lisa K.", "Tom F.", "Jane S."][i],
      title: t.title,
      description: t.desc,
      category: t.category,
      priority: t.priority,
      cause: null,
      diagnostic_checks: null,
      image_url: null,
      ai_suggestions: aiSuggestion,
      status: status,
      assigned_to: status !== "reported" ? tech.id : null,
      resolved_at: status === "resolved" ? daysAgo(i * 2) : null,
      created_at: daysAgo(14 - i * 2),
      updated_at: status === "resolved" ? daysAgo(i * 2) : daysAgo(i),
    });

    const actionMap = { reported: "issue_reported", assigned: "issue_assigned", under_inspection: "inspection_started", under_maintenance: "maintenance_started", resolved: "resolved" };
    store.maintenance_history.push({
      id: uuid(),
      asset_id: asset.id,
      issue_id: issueId,
      action: actionMap[status],
      description: `${actionMap[status].replace(/_/g, " ")}: ${t.title}`,
      performed_by: status === "reported" ? null : tech.id,
      timestamp: daysAgo(14 - i * 2),
    });
  });

  const issueIds = store.issues.map((i) => i.id);

  store.maintenance_records.push({
    id: uuid(),
    issue_id: issueIds[3],
    asset_id: assetIds[3].id,
    technician_id: techIds[1].id,
    inspection_findings: "Found worn hydraulic seals on lift cylinder. Minor crack in return line.",
    notes: "Replaced seals and patched return line. Will monitor for further leakage.",
    parts_used: ["Hydraulic seal kit", "Return line patch"],
    cost: 245.50,
    photos: [],
    ai_summary: null,
    confirmed: true,
    created_at: daysAgo(1),
  });
  store.maintenance_records.push({
    id: uuid(),
    issue_id: issueIds[2],
    asset_id: assetIds[2].id,
    technician_id: techIds[0].id,
    inspection_findings: "Server rack cooling fans completely seized. Power supply unit shows signs of failure.",
    notes: "Replaced all 4 cooling fans and the PSU. Temperature back to normal range.",
    parts_used: ["120mm cooling fan x4", "Power supply unit 500W"],
    cost: 680.00,
    photos: [],
    ai_summary: null,
    confirmed: true,
    created_at: daysAgo(2),
  });

  function inferCol(name, value) {
    if (name === "id" || name === "asset_id" || name === "issue_id" || name === "performed_by" || name === "technician_id" || name === "assigned_to") return "uuid";
    if (name === "count" || name === "open_issues") return "int";
    if (name.endsWith("_at") || name === "timestamp") return "timestamp";
    if (name === "cost") return "decimal";
    return "text";
  }

  function processResult(rows, rawSQL) {
    if (!rows || rows.length === 0) return rows || [];
    const upper = rawSQL.toUpperCase();
    const countMatch = upper.match(/COUNT\(\*\)(?:::\w+)?\s+AS\s+(\w+)/);
    if (countMatch) {
      const alias = countMatch[1];
      return [{ [alias]: rows.length }];
    }
    if (upper.includes("COUNT(*)") && !countMatch) {
      return [{ count: rows.length }];
    }
    if (upper.includes("GROUP BY")) {
      const groupMatch = rawSQL.match(/GROUP\s+BY\s+(\w+)/i);
      const groupCol = groupMatch ? groupMatch[1] : null;
      if (groupCol) {
        const groups = {};
        rows.forEach((r) => {
          const key = r[groupCol];
          if (!groups[key]) groups[key] = { ...r, count: 0 };
          groups[key].count = (groups[key].count || 0) + 1;
        });
        return Object.values(groups);
      }
      return rows;
    }
    return rows;
  }

  const handlers = {
    assets: {
      select: (table, conditions) => {
        let results = [...store.assets];
        const openIssuesMap = {};
        store.issues.forEach((i) => {
          if (i.status !== "resolved") {
            openIssuesMap[i.asset_id] = (openIssuesMap[i.asset_id] || 0) + 1;
          }
        });
        results = results.map((a) => ({ ...a, open_issues: openIssuesMap[a.id] || 0 }));

        conditions.forEach((c) => {
          if (c.col === "id") results = results.filter((r) => r.id === c.val);
          if (c.col === "asset_code") results = results.filter((r) => r.asset_code === c.val);
        });

        if (rawSQL.toUpperCase().includes("ORDER BY")) results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        results.forEach((r) => { delete r.open_issues; });
        return results;
      },
      insert: (table, cols, vals) => {
        const obj = { id: uuid(), created_at: new Date(), updated_at: new Date(), ...Object.fromEntries(cols.map((c, i) => [c, vals[i]])) };
        store.assets.push(obj);
        return [{ ...obj, open_issues: 0 }];
      },
      update: (table, sets, conditions) => {
        const idx = store.assets.findIndex((a) => conditions.every((c) => a[c.col] === c.val));
        if (idx >= 0) {
          sets.forEach(([k, v]) => { if (k !== "updated_at") store.assets[idx][k] = v; });
          store.assets[idx].updated_at = new Date();
          return [store.assets[idx]];
        }
        return [];
      },
    },
    issues: {
      select: (table, conditions) => {
        let results = [...store.issues];
        conditions.forEach((c) => {
          if (c.col === "id") results = results.filter((r) => r.id === c.val);
          if (c.col === "status") results = results.filter((r) => r.status === c.val);
          if (c.col === "asset_id") results = results.filter((r) => r.asset_id === c.val);
          if (c.col === "assigned_to") results = results.filter((r) => r.assigned_to === c.val);
        });
        results = results.map((i) => {
          const asset = store.assets.find((a) => a.id === i.asset_id);
          const tech = store.users.find((u) => u.id === i.assigned_to);
          return { ...i, asset_name: asset?.name || null, asset_code: asset?.asset_code || null, location: asset?.location || null, assigned_to_name: tech?.name || null };
        });
        if (rawSQL.toUpperCase().includes("ORDER BY")) results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return results;
      },
      insert: (table, cols, vals) => {
        const obj = { id: uuid(), created_at: new Date(), updated_at: new Date(), assigned_to: null, resolved_at: null, ...Object.fromEntries(cols.map((c, i) => [c, vals[i]])) };
        store.issues.push(obj);
        const assetIdx = store.assets.findIndex((a) => a.id === obj.asset_id);
        if (assetIdx >= 0) store.assets[assetIdx].status = "issue_reported";
        return [{ ...obj, asset_name: store.assets.find((a) => a.id === obj.asset_id)?.name || null, asset_code: store.assets.find((a) => a.id === obj.asset_id)?.asset_code || null }];
      },
      update: (table, sets, conditions) => {
        const idx = store.issues.findIndex((i) => conditions.every((c) => i[c.col] === c.val));
        if (idx >= 0) {
          const oldStatus = store.issues[idx].status;
          sets.forEach(([k, v]) => { if (k !== "updated_at" && k !== "resolved_at") store.issues[idx][k] = v; });
          if (sets.some(([k]) => k === "status")) {
            const newStatus = sets.find(([k]) => k === "status")[1];
            store.issues[idx].updated_at = new Date();
            if (newStatus === "resolved") store.issues[idx].resolved_at = new Date();
            const assetIdx = store.assets.findIndex((a) => a.id === store.issues[idx].asset_id);
            if (assetIdx >= 0) store.assets[assetIdx].status = newStatus === "resolved" ? "operational" : newStatus === "under_maintenance" ? "under_maintenance" : "issue_reported";
          }
          return [store.issues[idx]];
        }
        return [];
      },
    },
    users: {
      select: (table, conditions) => {
        let results = [...store.users];
        conditions.forEach((c) => {
          if (c.col === "id") results = results.filter((r) => r.id === c.val);
          if (c.col === "email") results = results.filter((r) => r.email === c.val);
          if (c.col === "role") results = results.filter((r) => r.role === c.val);
        });
        const cols = rawSQL.match(/SELECT\s+(.*?)\s+FROM/i);
        if (cols) {
          const selectedCols = cols[1].split(",").map((s) => s.trim().split(/\s+AS\s+/i)[0].trim());
          results = results.map((r) => Object.fromEntries(selectedCols.map((c) => {
            if (c === "*") return [c, r];
            const parts = c.split(".");
            const colName = parts[parts.length - 1];
            return [colName, r[colName]];
          }).filter(([k]) => k !== "*").flatMap(([k, v]) => {
            if (k === "password_hash" || typeof v === "object") return [];
            return [[k, v]];
          })));
        }
        return results;
      },
      insert: (table, cols, vals) => {
        const obj = { id: uuid(), created_at: new Date(), ...Object.fromEntries(cols.map((c, i) => [c, vals[i]])) };
        store.users.push(obj);
        return [obj];
      },
    },
    maintenance_history: {
      select: (table, conditions) => {
        let results = [...store.maintenance_history];
        conditions.forEach((c) => {
          if (c.col === "asset_id") results = results.filter((r) => r.asset_id === c.val);
        });
        results = results.map((h) => {
          const user = store.users.find((u) => u.id === h.performed_by);
          return { ...h, performed_by_name: user?.name || null };
        });
        if (rawSQL.toUpperCase().includes("ORDER BY")) results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return results.slice(0, 50);
      },
      insert: (table, cols, vals) => {
        const obj = { id: uuid(), timestamp: new Date(), ...Object.fromEntries(cols.map((c, i) => [c, vals[i]])) };
        store.maintenance_history.push(obj);
        return [obj];
      },
    },
    maintenance_records: {
      select: (table, conditions) => {
        let results = [...store.maintenance_records];
        conditions.forEach((c) => {
          if (c.col === "id") results = results.filter((r) => r.id === c.val);
          if (c.col === "issue_id") results = results.filter((r) => r.issue_id === c.val);
        });
        return results;
      },
      insert: (table, cols, vals) => {
        const obj = { id: uuid(), created_at: new Date(), ...Object.fromEntries(cols.map((c, i) => [c, vals[i]])) };
        store.maintenance_records.push(obj);
        return [obj];
      },
    },
    alerts: {
      select: (table, conditions) => {
        let results = [...store.alerts];
        conditions.forEach((c) => {
          if (c.col === "user_id") results = results.filter((r) => r.user_id === c.val);
        });
        results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return results.slice(0, 10);
      },
      insert: (table, cols, vals) => {
        const obj = { id: uuid(), created_at: new Date(), ...Object.fromEntries(cols.map((c, i) => [c, vals[i]])) };
        store.alerts.push(obj);
        return [obj];
      },
    },
  };

  let rawSQL = "";

  function mockSql(strings, ...values) {
    let sql = "";
    strings.forEach((s, i) => {
      sql += s;
      if (i < values.length) sql += `$${i + 1}`;
    });
    rawSQL = sql;

    const parsed = parseMockSQL(sql, values);
    if (!parsed) return Promise.resolve([]);

    const { operation, table, columns, values: vals, conditions, sets } = parsed;
    const handler = handlers[table];
    if (!handler) return Promise.resolve([]);

    try {
      let results;
      switch (operation) {
        case "SELECT":
          results = handler.select(table, conditions);
          results = processResult(results, rawSQL);
          return Promise.resolve(results);
        case "INSERT":
          results = handler.insert(table, columns, vals);
          return Promise.resolve(results);
        case "UPDATE":
          results = handler.update(table, sets, conditions);
          return Promise.resolve(results);
        default:
          return Promise.resolve([]);
      }
    } catch {
      return Promise.resolve([]);
    }
  }

  mockSql.unsafe = (queryStr) => ({ query: queryStr });

  return mockSql;
}

function parseMockSQL(sql, params) {
  const cleaned = sql.replace(/\s+/g, " ").trim();
  const upper = cleaned.toUpperCase();

  let match;

  match = cleaned.match(/^SELECT\s.*?\bFROM\s+(\w+)/i);
  if (match) {
    const table = match[1];
    const conditions = [];
    const whereMatch = cleaned.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const whereClause = whereMatch[1];
      const parts = whereClause.split(/\s+AND\s+/i);
      parts.forEach((part) => {
        const condMatch = part.match(/(\w+)\s*(=|!=|<|>|<=|>=|LIKE|IN|IS)\s*(.+)/i);
        if (condMatch) {
          let val = condMatch[3].trim();
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          else if (val.startsWith("$")) {
            const idx = parseInt(val.slice(1)) - 1;
            val = params[idx];
          } else if (val.toUpperCase() === "NULL") val = null;
          if (condMatch[2].toUpperCase() !== "IS") conditions.push({ col: condMatch[1], val, op: condMatch[2] });
        }
      });
    }
    return { operation: "SELECT", table, conditions };
  }

  match = cleaned.match(/^INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (match) {
    const table = match[1];
    const columns = match[2].split(",").map((s) => s.trim());
    const rawVals = match[3].split(",").map((s) => s.trim());
    const values = rawVals.map((v) => {
      if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
      if (v.startsWith("$")) return params[parseInt(v.slice(1)) - 1];
      if (v.toUpperCase() === "NULL") return null;
      if (v.toUpperCase() === "NOW()") return new Date();
      if (v.startsWith("JSON")) return JSON.parse(v.replace(/^[^'"]*['"]/, "").replace(/['"][^'"]*$/, ""));
      return v;
    });
    return { operation: "INSERT", table, columns, values };
  }

  match = cleaned.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+)|$)/i);
  if (match) {
    const table = match[1];
    const setClause = match[2];
    const sets = [];
    setClause.split(",").forEach((s) => {
      const [k, ...vParts] = s.trim().split("=");
      const key = k.trim();
      let val = vParts.join("=").trim();
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      else if (val.startsWith("$")) val = params[parseInt(val.slice(1)) - 1];
      else if (val.toUpperCase() === "NULL") val = null;
      else if (val.toUpperCase() === "NOW()") val = new Date();
      else if (val.toUpperCase() === "TRUE") val = true;
      else if (val.toUpperCase() === "FALSE") val = false;
      sets.push([key, val]);
    });
    const conditions = [];
    if (match[3]) {
      const whereClause = match[3];
      const parts = whereClause.split(/\s+AND\s+/i);
      parts.forEach((part) => {
        const cm = part.match(/(\w+)\s*=\s*(.+)/);
        if (cm) {
          let v = cm[2].trim();
          if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
          else if (v.startsWith("$")) v = params[parseInt(v.slice(1)) - 1];
          conditions.push({ col: cm[1], val: v });
        }
      });
    }
    return { operation: "UPDATE", table, sets, conditions };
  }

  return null;
}

let mockDbInstance = null;

export async function sql(strings, ...values) {
  if (process.env.DATABASE_URL && process.env.USE_REAL_DB === "true") {
    try {
      const client = neon(process.env.DATABASE_URL);
      return await client(strings, ...values);
    } catch {
      console.warn("Real DB failed, falling back to mock DB");
    }
  }
  if (!mockDbInstance) {
    mockDbInstance = createMockDb();
  }
  return mockDbInstance(strings, ...values);
}
