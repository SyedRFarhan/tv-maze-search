import { useState } from "react";
import axios from "axios";
import { Table, Input, Image } from "antd";

const { Search } = Input;

function renderColumnShowData(key: any) {
  return (_: unknown, data: any) => <span>{data?.show[key]}</span>;
}

function stripHtmlTags(str: string) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

const columns = [
  {
    title: "Show Image",
    dataIndex: "image",
    render: (_: unknown, data: any) => (
      <Image
        alt="Show image"
        src={data?.show?.image?.medium}
        width={150}
        preview={{
          src: data?.show?.image?.original,
        }}
      />
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    render: (_: unknown, data: any) => {
      return (
        <a href={data?.show.url ? `${data.show.url}/episodes` : "/"}>
          {data?.show.name ?? "N/A"}
        </a>
      );
    },
  },
  {
    title: "Language",
    dataIndex: "language",
    render: renderColumnShowData("language"),
  },
  {
    title: "Summary",
    dataIndex: "summary",
    render: (_: unknown, data: any) =>
      data?.show["summary"] ? stripHtmlTags(data?.show["summary"]) : "N/A",
  },
  {
    title: "Premiered",
    className: "column-money",
    dataIndex: "premiered",
    render: renderColumnShowData("premiered"),
  },
  {
    title: "Status",
    dataIndex: "status",
    render: renderColumnShowData("status"),
  },
];

export default function SearchShowsTable() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>([]);

  async function searchShows(query: string) {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.tvmaze.com/search/shows?q=${query}`
      );
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.warn("error: ", error);
      setLoading(false);
    }
  }

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={searchResults}
      bordered
      title={() => (
        <Search
          placeholder="input search text"
          onSearch={searchShows}
          enterButton
          loading={loading}
          size="large"
          aria-errormessage="test"
        />
      )}
    />
  );
}
