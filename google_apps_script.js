function doGet(e) {
  // Garante a existência das tabelas e colunas com cabeçalhos corretos
  inicializarPlanilha();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action;
  
  // Ação para obter a lista de usuários cadastrados
  if (action === "obterUsuarios") {
    var sheet = ss.getSheetByName("Usuarios");
    var rows = sheet.getDataRange().getValues();
    var data = [];
    
    // Cabeçalhos na linha 1: Usuário, Senha (Hash), Foto de Perfil, Criado em
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (row[0]) {
        data.push({
          username: String(row[0]),
          password: String(row[1]),
          profilePic: row[2] ? String(row[2]) : null,
          createdAt: row[3] ? String(row[3]) : null
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Ação padrão: obter a lista de despesas (filtra opcionalmente por usuário)
  var sheet = ss.getSheetByName("Despesas");
  var rows = sheet.getDataRange().getValues();
  var usuario = e.parameter.usuario;
  
  var data = [];
  // Cabeçalhos na linha 1: ID, Data, Descrição, Valor, Status, Categoria, Usuário
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var rowUser = row[6];
    if (!usuario || (rowUser && rowUser.toLowerCase() === usuario.toLowerCase())) {
      var dateVal = row[1];
      var dateString = "";
      if (dateVal instanceof Date) {
        var tz = ss.getSpreadsheetTimeZone();
        dateString = Utilities.formatDate(dateVal, tz, "yyyy-MM-dd");
      } else if (dateVal) {
        dateString = String(dateVal);
      }
      
      data.push({
        id: Number(row[0]) || row[0],
        data: dateString,
        descricao: String(row[2]),
        valor: Number(row[3]) || 0,
        status: String(row[4]),
        categoria: String(row[5]),
        usuario: rowUser ? String(rowUser) : ""
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Garante a existência das tabelas e colunas com cabeçalhos corretos
  inicializarPlanilha();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Payload inválido: " + err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var action = payload.action;
  var data = payload.data;
  
  // Adicionar nova despesa
  if (action === "add") {
    var sheet = ss.getSheetByName("Despesas");
    sheet.appendRow([
      data.id,
      data.data,
      data.descricao,
      data.valor,
      data.status,
      data.categoria,
      data.usuario
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Adicionado com sucesso" }))
      .setMimeType(ContentService.MimeType.JSON);
    
  // Editar despesa existente
  } else if (action === "update") {
    var sheet = ss.getSheetByName("Despesas");
    var idToFind = data.id;
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(idToFind)) {
        var rowNum = i + 1;
        sheet.getRange(rowNum, 2).setValue(data.data);
        sheet.getRange(rowNum, 3).setValue(data.descricao);
        sheet.getRange(rowNum, 4).setValue(data.valor);
        sheet.getRange(rowNum, 5).setValue(data.status);
        sheet.getRange(rowNum, 6).setValue(data.categoria);
        sheet.getRange(rowNum, 7).setValue(data.usuario);
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Atualizado com sucesso" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    // Se não encontrar o ID para atualizar, adiciona como nova para garantir que os dados não se percam
    sheet.appendRow([
      data.id,
      data.data,
      data.descricao,
      data.valor,
      data.status,
      data.categoria,
      data.usuario
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "ID não encontrado, despesa inserida automaticamente" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  // Excluir despesa
  } else if (action === "delete") {
    var sheet = ss.getSheetByName("Despesas");
    var idToFind = data.id;
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(idToFind)) {
        sheet.deleteRow(i + 1);
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Excluído com sucesso" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    // Retorna sucesso para não travar a fila local caso o registro já tenha sido excluído da planilha
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "ID não encontrado, já considerado excluído" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Ação desconhecida" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Cria automaticamente as abas (Despesas, Usuarios) e colunas caso não existam
function inicializarPlanilha() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Configura a aba "Despesas"
  var sheetDespesas = ss.getSheetByName("Despesas");
  if (!sheetDespesas) {
    sheetDespesas = ss.insertSheet("Despesas");
  }
  
  var headersDespesas = ["ID", "Data", "Descrição", "Valor", "Status", "Categoria", "Usuário"];
  if (sheetDespesas.getLastRow() === 0) {
    sheetDespesas.appendRow(headersDespesas);
  } else {
    // Garante que o cabeçalho esteja atualizado na linha 1
    var range = sheetDespesas.getRange(1, 1, 1, headersDespesas.length);
    range.setValues([headersDespesas]);
  }
  
  // 2. Configura a aba "Usuarios"
  var sheetUsuarios = ss.getSheetByName("Usuarios");
  if (!sheetUsuarios) {
    sheetUsuarios = ss.insertSheet("Usuarios");
  }
  
  var headersUsuarios = ["Usuário", "Senha (Hash)", "Foto de Perfil", "Criado em"];
  if (sheetUsuarios.getLastRow() === 0) {
    sheetUsuarios.appendRow(headersUsuarios);
    // Adiciona o usuário padrão admin (senha 'admin' SHA-256)
    sheetUsuarios.appendRow([
      "admin", 
      "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", 
      "", 
      new Date().toISOString()
    ]);
  } else {
    // Garante que o cabeçalho esteja atualizado na linha 1
    var rangeUser = sheetUsuarios.getRange(1, 1, 1, headersUsuarios.length);
    rangeUser.setValues([headersUsuarios]);
  }
  
  // Opcional: Remove a página vazia padrão ("Página1" ou "Sheet1") se as duas abas principais estiverem prontas
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    if (name !== "Despesas" && name !== "Usuarios" && sheets.length > 2) {
      try {
        ss.deleteSheet(sheets[i]);
      } catch (err) {
        // Ignora erro se não puder deletar
      }
    }
  }
}
