// Code generated by protoc-gen-go.
// source: google.golang.org/cloud/bigtable/internal/cluster_data_proto/bigtable_cluster_data.proto
// DO NOT EDIT!

/*
Package google_bigtable_admin_cluster_v1 is a generated protocol buffer package.

It is generated from these files:
	google.golang.org/cloud/bigtable/internal/cluster_data_proto/bigtable_cluster_data.proto

It has these top-level messages:
	Zone
	Cluster
*/
package google_bigtable_admin_cluster_v1

import proto "github.com/golang/protobuf/proto"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal

type StorageType int32

const (
	// The storage type used is unspecified.
	StorageType_STORAGE_UNSPECIFIED StorageType = 0
	// Data will be stored in SSD, providing low and consistent latencies.
	StorageType_STORAGE_SSD StorageType = 1
	// Data will be stored in HDD, providing high and less predictable
	// latencies.
	StorageType_STORAGE_HDD StorageType = 2
)

var StorageType_name = map[int32]string{
	0: "STORAGE_UNSPECIFIED",
	1: "STORAGE_SSD",
	2: "STORAGE_HDD",
}
var StorageType_value = map[string]int32{
	"STORAGE_UNSPECIFIED": 0,
	"STORAGE_SSD":         1,
	"STORAGE_HDD":         2,
}

func (x StorageType) String() string {
	return proto.EnumName(StorageType_name, int32(x))
}

// Possible states of a zone.
type Zone_Status int32

const (
	// The state of the zone is unknown or unspecified.
	Zone_UNKNOWN Zone_Status = 0
	// The zone is in a good state.
	Zone_OK Zone_Status = 1
	// The zone is down for planned maintenance.
	Zone_PLANNED_MAINTENANCE Zone_Status = 2
	// The zone is down for emergency or unplanned maintenance.
	Zone_EMERGENCY_MAINENANCE Zone_Status = 3
)

var Zone_Status_name = map[int32]string{
	0: "UNKNOWN",
	1: "OK",
	2: "PLANNED_MAINTENANCE",
	3: "EMERGENCY_MAINENANCE",
}
var Zone_Status_value = map[string]int32{
	"UNKNOWN": 0,
	"OK":      1,
	"PLANNED_MAINTENANCE":  2,
	"EMERGENCY_MAINENANCE": 3,
}

func (x Zone_Status) String() string {
	return proto.EnumName(Zone_Status_name, int32(x))
}

// A physical location in which a particular project can allocate Cloud BigTable
// resources.
type Zone struct {
	// A permanent unique identifier for the zone.
	// Values are of the form projects/<project>/zones/[a-z][-a-z0-9]*
	Name string `protobuf:"bytes,1,opt,name=name" json:"name,omitempty"`
	// The name of this zone as it appears in UIs.
	DisplayName string `protobuf:"bytes,2,opt,name=display_name" json:"display_name,omitempty"`
	// The current state of this zone.
	Status Zone_Status `protobuf:"varint,3,opt,name=status,enum=google.bigtable.admin.cluster.v1.Zone_Status" json:"status,omitempty"`
}

func (m *Zone) Reset()         { *m = Zone{} }
func (m *Zone) String() string { return proto.CompactTextString(m) }
func (*Zone) ProtoMessage()    {}

// An isolated set of Cloud BigTable resources on which tables can be hosted.
type Cluster struct {
	// A permanent unique identifier for the cluster. For technical reasons, the
	// zone in which the cluster resides is included here.
	// Values are of the form
	// projects/<project>/zones/<zone>/clusters/[a-z][-a-z0-9]*
	Name string `protobuf:"bytes,1,opt,name=name" json:"name,omitempty"`
	// The descriptive name for this cluster as it appears in UIs.
	// Must be unique per zone.
	DisplayName string `protobuf:"bytes,4,opt,name=display_name" json:"display_name,omitempty"`
	// The number of serve nodes allocated to this cluster.
	ServeNodes int32 `protobuf:"varint,5,opt,name=serve_nodes" json:"serve_nodes,omitempty"`
	// The maximum HDD storage usage allowed in this cluster, in bytes.
	HddBytes int64 `protobuf:"varint,6,opt,name=hdd_bytes" json:"hdd_bytes,omitempty"`
	// The maximum SSD storage usage allowed in this cluster, in bytes.
	SsdBytes int64 `protobuf:"varint,7,opt,name=ssd_bytes" json:"ssd_bytes,omitempty"`
	// What storage type to use for tables in this cluster. Only configurable at
	// cluster creation time. If unspecified, STORAGE_SSD will be used.
	DefaultStorageType StorageType `protobuf:"varint,8,opt,name=default_storage_type,enum=google.bigtable.admin.cluster.v1.StorageType" json:"default_storage_type,omitempty"`
}

func (m *Cluster) Reset()         { *m = Cluster{} }
func (m *Cluster) String() string { return proto.CompactTextString(m) }
func (*Cluster) ProtoMessage()    {}

func init() {
	proto.RegisterEnum("google.bigtable.admin.cluster.v1.StorageType", StorageType_name, StorageType_value)
	proto.RegisterEnum("google.bigtable.admin.cluster.v1.Zone_Status", Zone_Status_name, Zone_Status_value)
}