// analysisReportPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import { useAnalysesReportQuery } from "../../hooks/alalysesReport/useAnalysesReport";
import { useCompaniesForSelection } from "../../hooks/companies/useCompanyQuery";
import {
  Spin,
  Button,
  Typography,
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Statistic,
  message,
} from "antd";
import {
  BarChartOutlined,
  SearchOutlined,
  ClearOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import type { RootState } from "../../redux/store";
import dayjs from "dayjs";
import {
  setAnalysisReports,
  resetAnalysisReports,
  selectCompanyId,
  selectDateRange,
} from "../../redux/slices/analysesReportSlice";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const exportToXLSX = (data: any[], totals: any) => {
  try {
    // Проверяем, есть ли данные для экспорта
    if (!data || data.length === 0) {
      throw new Error("Нет данных для экспорта");
    }

    // Создаем данные для листа
    const wsData = [
      // Заголовки
      [
        "Название расписания",
        "Название промпта",
        "Дата",
        "Токены (вход)",
        "Токены (выход)",
      ],
      // Данные
      ...data.map((item) => [
        item.schedule_name,
        item.prompt_name,
        dayjs(item.date).format("DD.MM.YYYY HH:mm"),
        item.tokens_input,
        item.tokens_output,
      ]),
      // Итоговая строка
      ["ИТОГО", "", "", totals.total_tokens_input, totals.total_tokens_output],
    ];

    // Создаем рабочий лист
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Устанавливаем ширину колонок
    ws["!cols"] = [
      { wch: 30 }, // Название расписания
      { wch: 30 }, // Название промпта
      { wch: 20 }, // Дата
      { wch: 15 }, // Токены вход
      { wch: 15 }, // Токены выход
    ];

    // Применяем стили через cell objects
    if (!ws["!merges"]) ws["!merges"] = [];

    // Форматируем заголовки (первая строка)
    for (let col = 0; col < 5; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellRef]) continue;
      ws[cellRef].s = { font: { bold: true } };
    }

    // Форматируем итоговую строку
    for (let col = 0; col < 5; col++) {
      const rowIndex = wsData.length - 1;
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: col });
      if (!ws[cellRef]) continue;
      ws[cellRef].s = { font: { bold: true } };
    }

    // Создаем книгу и добавляем лист
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчет");

    // Генерируем имя файла
    const dateStr = dayjs().format("YYYY-MM-DD_HH-mm-ss");
    const fileName = `analysis_report_${dateStr}.xlsx`;

    // Экспортируем файл
    XLSX.writeFile(wb, fileName);
    return true;
  } catch (error) {
    console.error("Ошибка при экспорте в XLSX:", error);
    return false;
  }
};

export const AnalysisReportPage: React.FC = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(selectCompanyId);
  const dateRange = useSelector(selectDateRange);
  const { data: companiesData } = useCompaniesForSelection();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Отчеты по анализам", to: "/analysis-reports" },
      ])
    );
  }, [dispatch]);

  const {
    data: reportData,
    isLoading,
    isError,
    refetch,
  } = useAnalysesReportQuery({
    company_id: companyId,
    date_from: dateRange[0],
    date_to: dateRange[1],
  });

  const handleSearch = () => {
    if (!companyId) {
      message.error("Пожалуйста, выберите компанию");
      return;
    }
    if (!dateRange[0] || !dateRange[1]) {
      message.error("Пожалуйста, выберите диапазон дат");
      return;
    }
    refetch();
  };

  const handleReset = () => {
    dispatch(resetAnalysisReports());
  };

  const handleCompanyChange = (value: string) => {
    dispatch(setAnalysisReports({ companyId: value, dateRange }));
  };

  const handleDateChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      dispatch(
        setAnalysisReports({
          companyId,
          dateRange: [dates[0].toISOString(), dates[1].toISOString()],
        })
      );
    } else {
      dispatch(setAnalysisReports({ companyId, dateRange: ["", ""] }));
    }
  };

  const handleExport = () => {
    if (
      !reportData ||
      !reportData.analyses ||
      reportData.analyses.length === 0
    ) {
      message.error("Нет данных для экспорта");
      return;
    }

    const success = exportToXLSX(reportData.analyses, {
      total_tokens_input: reportData.total_tokens_input,
      total_tokens_output: reportData.total_tokens_output,
    });

    if (success) {
      message.success("Отчет успешно экспортирован");
    } else {
      message.error("Не удалось экспортировать отчет");
    }
  };

  const columns = [
    {
      title: "Название расписания",
      dataIndex: "schedule_name",
      key: "schedule_name",
    },
    {
      title: "Название промпта",
      dataIndex: "prompt_name",
      key: "prompt_name",
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD.MM.YYYY HH:mm"),
    },
    {
      title: "Токены (вход)",
      dataIndex: "tokens_input",
      key: "tokens_input",
    },
    {
      title: "Токены (выход)",
      dataIndex: "tokens_output",
      key: "tokens_output",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Градиентный заголовок */}
        <Card
          className="gradient-header"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <div className="header-content">
                <div className="header-icon">
                  <BarChartOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <div className="header-text">
                  <ContextualNavigation
                    textColor="rgba(255, 255, 255, 0.9)"
                    size="small"
                  />
                  <Title level={2} className="header-title">
                    Отчеты по анализам
                  </Title>
                  <Text className="header-description">
                    Статистика использования токенов
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Фильтры */}
        <Card className="filters-card" style={{ marginBottom: 0 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6} style={{ padding: "8px" }}>
              <Select
                placeholder="Выберите компанию"
                style={{ width: "100%" }}
                value={companyId || undefined}
                onChange={handleCompanyChange}
              >
                {companiesData?.companies.map((company) => (
                  <Option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={8} style={{ padding: "8px" }}>
              <RangePicker
                showTime
                style={{ width: "100%" }}
                value={[
                  dateRange[0] ? dayjs(dateRange[0]) : null,
                  dateRange[1] ? dayjs(dateRange[1]) : null,
                ]}
                onChange={handleDateChange}
                format="DD.MM.YYYY HH:mm"
              />
            </Col>

            <Col xs={12} sm={6} md={2} style={{ padding: "8px" }}>
              <Button
                icon={<SearchOutlined />}
                onClick={handleSearch}
                disabled={!companyId || !dateRange[0] || !dateRange[1]}
                style={{ width: "100%" }}
              >
                Поиск
              </Button>
            </Col>

            <Col xs={12} sm={6} md={2} style={{ padding: "4px" }}>
              <Button
                icon={<ClearOutlined />}
                onClick={handleReset}
                disabled={!companyId && !dateRange[0] && !dateRange[1]}
                style={{ width: "100%" }}
              >
                Сбросить
              </Button>
            </Col>

            <Col xs={12} sm={6} md={2} style={{ padding: "8px" }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={!companyId || !dateRange[0] || !dateRange[1]}
                style={{ width: "100%" }}
              >
                Экспорт
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Статистика и таблица */}
        {reportData && (
          <>
            <Card>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Всего входных токенов"
                    value={reportData.total_tokens_input}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Всего выходных токенов"
                    value={reportData.total_tokens_output}
                  />
                </Col>
              </Row>
            </Card>

            <Card>
              <Table
                columns={columns}
                dataSource={reportData.analyses}
                rowKey={(record) => `${record.schedule_name}-${record.date}`}
                loading={isLoading}
                pagination={false}
              />
            </Card>
          </>
        )}

        {isLoading && (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Spin size="large" />
          </div>
        )}
        {isError && (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Text type="danger">Произошла ошибка при загрузке данных</Text>
          </div>
        )}
      </div>
    </div>
  );
};
